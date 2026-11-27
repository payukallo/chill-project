import axios from "axios";
import { api } from "../components/utils/axiosApi";

export type UploadKind = "image" | "video";

const MiB = 1024 * 1024;

export const uploadRules = {
  image: {
    maxSize: 10 * MiB,
    types: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ],
  },
  video: {
    maxSize: 500 * MiB,
    types: ["video/mp4", "video/webm"],
  },
};

interface PresignResponse {
  status: string;
  data: {
    key: string;
    uploadUrl: string;
    uploadToken: string;
    expiresIn: number;
    headers: Record<string, string>;
  };
}

interface CompleteResponse {
  status: string;
  data: {
    key: string;
    size: number;
    contentType: string;
  };
}

export function validateUploadFile(
  file: File,
  kind: UploadKind,
) {
  const rule = uploadRules[kind];

  if (!rule.types.includes(file.type)) {
    throw new Error("Format file tidak didukung");
  }

  if (file.size <= 0) {
    throw new Error("File kosong");
  }

  if (file.size > rule.maxSize) {
    throw new Error(
      `Ukuran maksimum ${rule.maxSize / MiB} MiB`,
    );
  }
}

export async function uploadAdminMedia(
  file: File,
  kind: UploadKind,
  onProgress: (percent: number) => void,
  signal: AbortSignal,
) {
  validateUploadFile(file, kind);

  const presign = await api.post<PresignResponse>(
    "/uploads/presign",
    {
      kind,
      contentType: file.type,
      size: file.size,
    },
    { signal },
  );

  const {
    key,
    uploadUrl,
    uploadToken,
    headers,
  } = presign.data.data;

  // Gunakan XMLHttpRequest langsung ke R2.
  // JWT Chill tidak dikirim ke R2.
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    const abort = () => xhr.abort();

    const cleanup = () =>
      signal.removeEventListener("abort", abort);

    xhr.open("PUT", uploadUrl);

    xhr.withCredentials = false;
    xhr.timeout = 900000;

    for (const [name, value] of Object.entries(headers)) {
      xhr.setRequestHeader(name, value);
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(
          Math.min(
            99,
            Math.round(
              (event.loaded / event.total) * 100,
            ),
          ),
        );
      }
    };

    xhr.onload = () => {
      cleanup();

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(
          new Error(`Upload R2 gagal (HTTP ${xhr.status})`),
        );
      }
    };

    xhr.onerror = () => {
      cleanup();
      reject(new Error("Koneksi upload R2 gagal"));
    };

    xhr.ontimeout = () => {
      cleanup();
      reject(new Error("Waktu upload habis"));
    };

    xhr.onabort = () => {
      cleanup();
      reject(new Error("Upload dibatalkan"));
    };

    if (signal.aborted) {
      reject(new Error("Upload dibatalkan"));
      return;
    }

    signal.addEventListener("abort", abort, {
      once: true,
    });

    xhr.send(file);
  });

  const complete = await api.post<CompleteResponse>(
    "/uploads/complete",
    { uploadToken },
    { signal },
  );

  const result = complete.data.data;

  if (
    result.key !== key ||
    result.size !== file.size ||
    result.contentType !== file.type
  ) {
    throw new Error("Verifikasi upload tidak sesuai");
  }

  onProgress(100);

  return result.key;
}

export function getUploadError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (typeof message === "string") {
      return message;
    }

    return "Permintaan upload gagal";
  }

  return error instanceof Error
    ? error.message
    : "Upload gagal";
}
