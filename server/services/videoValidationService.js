const AppError = require("../utils/AppError");

const MAX_VIDEO_BYTES = 500 * 1024 * 1024;
const MAX_READ_BYTES = 8 * 1024 * 1024;
const MAX_REQUESTS = 128;
const PAGE_SIZE = 64 * 1024;

function invalidVideo() {
  return new AppError(
    "Isi atau struktur file video tidak valid atau tidak didukung",
    422
  );
}

function ensure(condition) {
  if (!condition) throw invalidVideo();
}

function createReader(size, readBytes) {
  let requests = 0;
  let bytesRead = 0;
  const cache = new Map();

  async function page(index) {
    if (cache.has(index)) {
      return cache.get(index);
    }

    const offset = index * PAGE_SIZE;
    const length = Math.min(PAGE_SIZE, size - offset);

    ensure(length > 0);
    ensure(++requests <= MAX_REQUESTS);

    bytesRead += length;
    ensure(bytesRead <= MAX_READ_BYTES);

    const data = await readBytes(offset, length);

    if (
      !Buffer.isBuffer(data) ||
      data.length !== length
    ) {
      throw new Error("INCOMPLETE_VIDEO_READ");
    }

    cache.set(index, data);
    return data;
  }

  async function read(offset, length) {
    ensure(Number.isSafeInteger(offset));
    ensure(Number.isSafeInteger(length));
    ensure(offset >= 0 && length > 0);
    ensure(offset + length <= size);
    ensure(length <= PAGE_SIZE);

    const chunks = [];
    let pos = offset;
    let remaining = length;

    while (remaining > 0) {
      const index = Math.floor(pos / PAGE_SIZE);
      const data = await page(index);
      const start = pos % PAGE_SIZE;
      const count = Math.min(
        remaining,
        data.length - start
      );

      ensure(count > 0);

      chunks.push(
        data.subarray(start, start + count)
      );

      pos += count;
      remaining -= count;
    }

    return Buffer.concat(chunks, length);
  }

  return {
    read,
    stats: () => ({ requests, bytesRead })
  };
}

// ================================
// MP4
// ================================

async function mp4Boxes(reader, start, end) {
  const boxes = [];
  let pos = start;

  while (pos < end) {
    ensure(boxes.length < 4096);
    ensure(end - pos >= 8);

    const header = await reader.read(pos, 8);

    let size = header.readUInt32BE(0);
    const type = header.toString("latin1", 4, 8);
    let headerSize = 8;

    if (size === 1) {
      ensure(end - pos >= 16);

      const extended = await reader.read(pos + 8, 8);
      const value = extended.readBigUInt64BE(0);

      ensure(value <= BigInt(Number.MAX_SAFE_INTEGER));

      size = Number(value);
      headerSize = 16;

    } else if (size === 0) {
      size = end - pos;
    }

    ensure(size >= headerSize);
    ensure(pos + size <= end);

    boxes.push({
      type,
      start: pos + headerSize,
      end: pos + size,
      payloadSize: size - headerSize
    });

    pos += size;
  }

  ensure(pos === end);
  return boxes;
}

async function validateMp4(reader, size) {
  const root = await mp4Boxes(reader, 0, size);

  const ftyp = root.filter(b => b.type === "ftyp");
  const moov = root.filter(b => b.type === "moov");

  ensure(root[0]?.type === "ftyp");
  ensure(ftyp.length === 1);
  ensure(moov.length === 1);

  ensure(
    root.some(
      b => b.type === "mdat" && b.payloadSize > 0
    )
  );

  ensure(
    ftyp[0].payloadSize >= 8 &&
    ftyp[0].payloadSize <= 4096 &&
    ftyp[0].payloadSize % 4 === 0
  );

  const brandData = await reader.read(
    ftyp[0].start,
    ftyp[0].payloadSize
  );

  const brands = [
    brandData.toString("latin1", 0, 4)
  ];

  for (let pos = 8; pos < brandData.length; pos += 4) {
    brands.push(
      brandData.toString("latin1", pos, pos + 4)
    );
  }

  ensure(
    brands.some(
      brand => /^(isom|iso[2-9]|mp41|mp42|avc1|dash|M4V )$/
        .test(brand)
    )
  );

  ensure(
    !brands.some(
      brand => ["avif", "avis", "heic", "heix"].includes(brand)
    )
  );

  const movie = await mp4Boxes(
    reader, moov[0].start, moov[0].end
  );

  ensure(movie.some(b => b.type === "mvhd"));

  let videoTrack = false;

  for (const track of movie.filter(b => b.type === "trak")) {
    const children = await mp4Boxes(
      reader, track.start, track.end
    );

    const media = children.find(b => b.type === "mdia");
    if (!media) continue;

    const mediaBoxes = await mp4Boxes(
      reader, media.start, media.end
    );

    const handler = mediaBoxes.find(b => b.type === "hdlr");
    if (!handler || handler.payloadSize < 24) continue;

    const data = await reader.read(handler.start, 12);

    if (data.toString("latin1", 8, 12) !== "vide") {
      continue;
    }

    const minf = mediaBoxes.find(b => b.type === "minf");
    if (!minf) continue;

    const minfBoxes = await mp4Boxes(
      reader, minf.start, minf.end
    );

    const stbl = minfBoxes.find(b => b.type === "stbl");
    if (!stbl) continue;

    const table = await mp4Boxes(
      reader, stbl.start, stbl.end
    );

    const stsd = table.find(b => b.type === "stsd");

    if (!stsd || stsd.payloadSize < 16) continue;

    const description = await reader.read(stsd.start, 8);
    const count = description.readUInt32BE(4);

    const entries = await mp4Boxes(
      reader, stsd.start + 8, stsd.end
    );

    ensure(count === entries.length);

    if (
      entries.some(
        entry =>
          ["avc1", "avc3", "hvc1", "hev1", "av01",
           "vp09", "mp4v"].includes(entry.type) &&
          entry.payloadSize >= 78
      )
    ) {
      videoTrack = true;
    }
  }

  ensure(videoTrack);
}

// ================================
// WebM
// ================================

function vintLength(first, maximum) {
  ensure(first !== 0);

  let length = 1;
  let mask = 0x80;

  while (!(first & mask)) {
    length++;
    mask >>= 1;
  }

  ensure(length <= maximum);
  return length;
}

async function ebmlElement(reader, pos, end) {
  ensure(pos < end);

  const first = await reader.read(pos, 1);
  const idLength = vintLength(first[0], 4);

  ensure(pos + idLength < end);

  const idData = await reader.read(pos, idLength);

  let id = 0;

  for (const byte of idData) {
    id = id * 256 + byte;
  }

  const sizePos = pos + idLength;
  const sizeFirst = await reader.read(sizePos, 1);
  const sizeLength = vintLength(sizeFirst[0], 8);

  ensure(sizePos + sizeLength <= end);

  const data = await reader.read(sizePos, sizeLength);

  let value = BigInt(
    data[0] & (0xff >> sizeLength)
  );

  for (let i = 1; i < sizeLength; i++) {
    value = value * 256n + BigInt(data[i]);
  }

  const unknown =
    value === (1n << BigInt(7 * sizeLength)) - 1n;

  const start = sizePos + sizeLength;

  if (unknown) {
    return { id, start, end, unknown };
  }

  ensure(value <= BigInt(end - start));

  return {
    id,
    start,
    end: start + Number(value),
    unknown: false
  };
}

async function ebmlChildren(reader, start, end) {
  const children = [];
  let pos = start;

  while (pos < end) {
    ensure(children.length < 4096);

    const element = await ebmlElement(reader, pos, end);

    ensure(!element.unknown);
    ensure(element.end > pos);

    children.push(element);
    pos = element.end;
  }

  return children;
}

async function ebmlText(reader, element) {
  ensure(element);
  const length = element.end - element.start;
  ensure(length > 0 && length <= 128);

  const data = await reader.read(
    element.start, length
  );

  return data.toString("latin1");
}

async function ebmlUInt(reader, element) {
  ensure(element);

  const length = element.end - element.start;

  ensure(length >= 1 && length <= 6);

  const data = await reader.read(element.start, length);
  return data.readUIntBE(0, length);
}

async function validateWebm(reader, size) {
  const header = await ebmlElement(reader, 0, size);

  ensure(header.id === 0x1a45dfa3);
  ensure(!header.unknown);

  const fields = await ebmlChildren(
    reader, header.start, header.end
  );

  const docType = fields.find(e => e.id === 0x4282);

  ensure(await ebmlText(reader, docType) === "webm");

  const segment = await ebmlElement(
    reader, header.end, size
  );

  ensure(segment.id === 0x18538067);
  ensure(segment.end === size);

  let pos = segment.start;
  let hasVideo = false;
  let hasCluster = false;
  let hasInfo = false;
  let count = 0;

  while (pos < segment.end) {
    ensure(++count <= 4096);

    const element = await ebmlElement(
      reader, pos, segment.end
    );

    // Unknown-size Cluster belum didukung.
    ensure(!element.unknown);

    if (element.id === 0x1549a966) {
      hasInfo = element.end > element.start;
    }

    if (element.id === 0x1654ae6b) {
      const tracks = await ebmlChildren(
        reader, element.start, element.end
      );

      for (const track of tracks.filter(e => e.id === 0xae)) {
        const fields = await ebmlChildren(
          reader, track.start, track.end
        );

        const type = fields.find(e => e.id === 0x83);
        const codec = fields.find(e => e.id === 0x86);
        const video = fields.find(e => e.id === 0xe0);

        if (!type || !codec || !video) continue;

        if (await ebmlUInt(reader, type) !== 1) {
          continue;
        }

        const codecId = await ebmlText(reader, codec);

        if (!["V_VP8", "V_VP9", "V_AV1"].includes(codecId)) {
          continue;
        }

        const dimensions = await ebmlChildren(
          reader, video.start, video.end
        );

        const width = dimensions.find(e => e.id === 0xb0);
        const height = dimensions.find(e => e.id === 0xba);

        if (
          width && height &&
          await ebmlUInt(reader, width) > 0 &&
          await ebmlUInt(reader, height) > 0
        ) {
          hasVideo = true;
        }
      }
    }

    if (element.id === 0x1f43b675) {
      const children = await ebmlChildren(
        reader, element.start, element.end
      );

      if (
        children.some(
          e => (e.id === 0xa3 || e.id === 0xa0) &&
               e.end - e.start > 4
        )
      ) {
        hasCluster = true;
      }
    }

    pos = element.end;
  }

  ensure(hasInfo && hasVideo && hasCluster);
}

async function validateVideo({
  size,
  contentType,
  readBytes
}) {
  ensure(Number.isSafeInteger(size));
  ensure(size > 0 && size <= MAX_VIDEO_BYTES);
  ensure(typeof readBytes === "function");

  const reader = createReader(size, readBytes);

  if (contentType === "video/mp4") {
    await validateMp4(reader, size);

  } else if (contentType === "video/webm") {
    await validateWebm(reader, size);

  } else {
    throw invalidVideo();
  }

  return {
    contentType,
    ...reader.stats()
  };
}

module.exports = {
  validateVideo,
  MAX_VIDEO_BYTES,
  MAX_READ_BYTES,
  MAX_REQUESTS
};
