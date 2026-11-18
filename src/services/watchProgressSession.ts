import { registerWatchSession, saveSessionProgress } from "../components/type/WatchHistoryApi";

export type WatchSession = {
  sessionId: string;
  mediaId: number;
  episodeId: number | null;
  sequence: number;
  status: "registering" | "ready" | "completed" | "blocked";
  registration: Promise<void>;
  queue: Promise<void>;
  finishing: boolean;
};

export function createWatchSession(mediaId: number, episodeId: number | null): WatchSession {
  const session: WatchSession = {
    sessionId: crypto.randomUUID(),
    mediaId,
    episodeId,
    sequence: 0,
    status: "registering",
    registration: Promise.resolve(),
    queue: Promise.resolve(),
    finishing: false,
  };

  session.registration = registerWatchSession({
    sessionId: session.sessionId,
    mediaId,
    episodeId,
  })
    .then((result) => {
      if (result.alreadyCompleted) {
        session.status = "completed";
        return;
      }
      if (
        result.sessionId !== session.sessionId ||
        (result.alreadyRegistered && result.isActive === false)
      ) {
        session.status = "blocked";
        return;
      }
      const lastSequence = Number(result.lastSequence ?? 0);
      if (!Number.isSafeInteger(lastSequence) || lastSequence < 0) {
        session.status = "blocked";
        return;
      }
      session.sequence = lastSequence;
      session.status = "ready";
    })
    .catch((error: unknown) => {
      session.status = "blocked";
      console.error("Gagal mendaftarkan sesi pemutaran:", error);
    });

  return session;
}

// Satu antrean per sesi: request periodik dan completion tidak akan memakai
// sequence yang sama atau datang ke backend dengan urutan terbalik.
async function sendProgress(
  session: WatchSession,
  positionSeconds: number,
  durationSeconds: number,
  isCompleted: boolean,
): Promise<boolean> {
  await session.registration;
  if (session.status === "completed") return isCompleted;
  if (session.status !== "ready") return false;

  const duration = Math.floor(durationSeconds);
  if (!Number.isFinite(duration) || duration <= 0) return false;
  const progress = isCompleted
    ? duration
    : Math.max(0, Math.min(Math.floor(positionSeconds), duration));
  if (!isCompleted && progress <= 0) return false;

  const sequence = session.sequence + 1;
  if (!Number.isSafeInteger(sequence)) {
    session.status = "blocked";
    return false;
  }

  try {
    const result = await saveSessionProgress({
      sessionId: session.sessionId,
      mediaId: session.mediaId,
      episodeId: session.episodeId,
      sequence,
      progressSeconds: progress,
      durationSeconds: duration,
      isCompleted,
    });
    if (result.alreadyCompleted) {
      session.status = "completed";
      return isCompleted;
    }
    if (Number(result.lastSequence) !== sequence) {
      throw new Error("Sequence respons backend tidak sesuai");
    }
    session.sequence = sequence;
    if (isCompleted) session.status = "completed";
    return true;
  } catch (error: unknown) {
    // Tidak ada rollback, retry, resync, ataupun takeover otomatis.
    session.status = "blocked";
    console.error("Request progres gagal; sesi dihentikan:", error);
    return false;
  }
}

export function savePeriodicProgress(
  session: WatchSession,
  positionSeconds: number,
  durationSeconds: number,
): void {
  if (
    session.finishing ||
    session.status === "completed" ||
    session.status === "blocked" ||
    !Number.isFinite(positionSeconds) ||
    !Number.isFinite(durationSeconds) ||
    positionSeconds <= 0 ||
    durationSeconds <= 0
  ) return;

  session.queue = session.queue.then(async () => {
    // Progres yang sudah masuk antrean sebelum video selesai tetap dieksekusi
    // lebih dahulu. Completion selalu antre paling akhir.
    await sendProgress(session, positionSeconds, durationSeconds, false);
  });
}

// Satu-satunya penyimpanan di luar interval 5 detik: event video selesai.
// Return true hanya jika status selesai sudah terkonfirmasi oleh backend.
export function completeWatchSession(
  session: WatchSession,
  durationSeconds: number,
): Promise<boolean> {
  if (session.status === "completed") return Promise.resolve(true);
  if (session.status === "blocked" || session.finishing) return Promise.resolve(false);
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) return Promise.resolve(false);

  session.finishing = true;
  let completionConfirmed = false;
  session.queue = session.queue.then(async () => {
    completionConfirmed = await sendProgress(session, durationSeconds, durationSeconds, true);
  });
  return session.queue.then(() => completionConfirmed);
}
