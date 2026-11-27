import axios from "axios";
import {
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { RefObject } from "react";
import { getPlayback } from "../../services/playbackService";

const REFRESH_MARGIN = 300_000;
const RETRY_DELAYS = [5_000, 15_000];

function getExpiry(url: string): number {
  try {
    const params = new URL(url).searchParams;

    const date = params.get("X-Amz-Date") ?? "";
    const seconds = Number(params.get("X-Amz-Expires"));

    const match = date.match(
      /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/,
    );

    if (
      !match ||
      !Number.isFinite(seconds) ||
      seconds <= 0
    ) {
      return 0;
    }

    const [, y, m, d, h, min, sec] = match;

    const timestamp = Date.UTC(
      Number(y),
      Number(m) - 1,
      Number(d),
      Number(h),
      Number(min),
      Number(sec),
    );

    return timestamp + seconds * 1000;
  } catch {
    return 0;
  }
}

function testMode(): boolean {
  return (
    import.meta.env.DEV &&
    sessionStorage.getItem("chill:refresh-test") === "1"
  );
}

interface Snapshot {
  url: string;
  time: number;
  playing: boolean;
  ready: boolean;
}

interface Options {
  src: string;
  mediaId?: number;
  episodeId: number | null;
  videoRef: RefObject<HTMLVideoElement | null>;
  suspend: (video: HTMLVideoElement) => boolean;
  restore: (video: HTMLVideoElement) => boolean;
  setPlaying: (value: boolean) => void;
  blocked: boolean;
}

interface Runtime {
  stop: () => void;
  metadata: (video: HTMLVideoElement) => boolean;
  mediaError: () => void;
}

export function usePlaybackRefresh(options: Options) {
  const {
    src,
    mediaId,
    episodeId,
    videoRef,
  } = options;

  const identity = JSON.stringify([
    mediaId,
    episodeId,
    src,
  ]);

  const latest = useRef(options);
  const runtime = useRef<Runtime | null>(null);

  const [replacement, setReplacement] = useState<{
    identity: string;
    url: string;
  } | null>(null);

  const [replacing, setReplacing] = useState(false);
  const [error, setError] = useState("");

  useLayoutEffect(() => {
    latest.current = options;
  });

  useLayoutEffect(() => {
    setReplacement(null);
    setReplacing(false);
    setError("");

    if (!src || !mediaId) return;

    let active = true;
    let expiry = getExpiry(src);
    let currentUrl = src;
    let dueAt = 0;
    let failures = 0;

    let request: AbortController | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let metadataTimer: ReturnType<typeof setTimeout> | null = null;

    let snapshot: Snapshot | null = null;

    function clearTimer() {
      if (timer !== null) clearTimeout(timer);
      timer = null;
    }

    function stop() {
      active = false;
      clearTimer();

      if (metadataTimer !== null) {
        clearTimeout(metadataTimer);
      }

      request?.abort();
      request = null;
      snapshot = null;
    }

    function terminate(message: string) {
      stop();

      const video = videoRef.current;

      if (video) {
        latest.current.suspend(video);
        video.pause();
      }

      setReplacement({
        identity,
        url: "",
      });

      latest.current.setPlaying(false);
      setReplacing(false);
      setError(message);
    }

    function schedule(delay: number) {
      clearTimer();

      if (!active) return;

      dueAt = Date.now() + Math.max(0, delay);

      timer = setTimeout(() => {
        void refresh();
      }, Math.max(0, delay));
    }

    function scheduleNormal() {
      if (!active) return;

      if (testMode()) {
        schedule(20_000);
        return;
      }

      if (expiry > 0) {
        const remaining = expiry - Date.now();

        schedule(
          Math.max(
            1_000,
            remaining - Math.min(
              REFRESH_MARGIN,
              Math.max(1_000, remaining / 2),
            ),
          ),
        );
      }
    }

    async function refresh() {
      if (
        !active ||
        request ||
        snapshot ||
        latest.current.blocked
      ) {
        return;
      }

      if (failures >= 3) {
        terminate(
          "Akses video kedaluwarsa. Buka kembali video.",
        );
        return;
      }

      clearTimer();

      const controller = new AbortController();

      request = controller;

      try {
        const result = await getPlayback(
          mediaId!,
          episodeId,
          controller.signal,
        );

        if (
          !active ||
          controller.signal.aborted ||
          latest.current.blocked
        ) {
          return;
        }

        if (
          result.mediaId !== mediaId ||
          result.episodeId !== episodeId ||
          !result.videoUrl ||
          !Number.isFinite(result.expiresIn) ||
          result.expiresIn <= 0
        ) {
          terminate("Respons akses video tidak valid.");
          return;
        }

        const newExpiry = getExpiry(result.videoUrl);

        if (newExpiry <= Date.now()) {
          terminate("Signed URL baru tidak valid.");
          return;
        }

        expiry = newExpiry;
        failures = 0;

        if (result.videoUrl === currentUrl) {
          scheduleNormal();
          return;
        }

        const video = videoRef.current;

        if (!video) return;

        const time = Number.isFinite(video.currentTime)
          ? video.currentTime
          : 0;

        const playing = !video.paused && !video.ended;

        const ready = latest.current.suspend(video);

        snapshot = {
          url: result.videoUrl,
          time,
          playing,
          ready,
        };

        video.pause();

        currentUrl = result.videoUrl;

        setReplacing(true);
        setError("");

        setReplacement({
          identity,
          url: currentUrl,
        });

        metadataTimer = setTimeout(() => {
          if (active && snapshot) {
            terminate(
              "Video gagal dimuat setelah pembaruan akses.",
            );
          }
        }, 30_000);
      } catch (err: unknown) {
        if (
          !active ||
          controller.signal.aborted
        ) {
          return;
        }

        const status = axios.isAxiosError(err)
          ? err.response?.status
          : undefined;

        if (status === 401) {
          terminate(
            "Sesi login tidak valid. Silakan login kembali.",
          );
          return;
        }

        if (status === 403) {
          terminate(
            "Akses video tidak lagi diizinkan.",
          );
          return;
        }

        if (
          status !== undefined &&
          status < 500 &&
          status !== 408 &&
          status !== 429
        ) {
          terminate("Akses video tidak dapat diperbarui.");
          return;
        }

        failures++;

        if (failures < 3) {
          schedule(RETRY_DELAYS[failures - 1]);
        } else {
          const remaining = expiry - Date.now();

          if (remaining > 0) {
            schedule(remaining);
          } else {
            terminate(
              "Koneksi gagal. Buka kembali video.",
            );
          }
        }
      } finally {
        if (request === controller) {
          request = null;
        }
      }
    }

    function metadata(video: HTMLVideoElement): boolean {
      if (!active) return true;
      if (!snapshot) return false;

      if (
        video.currentSrc !==
        new URL(snapshot.url).href
      ) {
        return true;
      }

      const saved = snapshot;
      snapshot = null;

      if (metadataTimer !== null) {
        clearTimeout(metadataTimer);
        metadataTimer = null;
      }

      if (Number.isFinite(video.duration)) {
        video.currentTime = Math.max(
          0,
          Math.min(saved.time, video.duration),
        );
      }

      setReplacing(false);
      scheduleNormal();

      // Jika metadata awal belum pernah siap,
      // gunakan restore Watch History normal.
      if (!saved.ready) return false;

      const canResume = latest.current.restore(video);

      if (
        saved.playing &&
        canResume &&
        active &&
        !latest.current.blocked
      ) {
        void video.play().catch(() => {
          latest.current.setPlaying(false);
        });
      }

      return true;
    }

    function mediaError() {
      if (!active) return;

      if (snapshot) {
        terminate(
          "Video gagal dimuat setelah pembaruan akses.",
        );
        return;
      }

      if (
        expiry > 0 &&
        expiry - Date.now() <= REFRESH_MARGIN &&
        failures === 0
      ) {
        void refresh();
      }
    }

    function checkDue() {
      if (
        active &&
        !snapshot &&
        dueAt > 0 &&
        Date.now() >= dueAt
      ) {
        void refresh();
      }
    }

    runtime.current = {
      stop,
      metadata,
      mediaError,
    };

    scheduleNormal();

    document.addEventListener(
      "visibilitychange",
      checkDue,
    );

    window.addEventListener("online", checkDue);
    window.addEventListener("focus", checkDue);

    return () => {
      stop();

      runtime.current = null;

      document.removeEventListener(
        "visibilitychange",
        checkDue,
      );

      window.removeEventListener("online", checkDue);
      window.removeEventListener("focus", checkDue);
    };
  }, [identity, src, mediaId, episodeId, videoRef]);

  useLayoutEffect(() => {
    if (options.blocked) {
      runtime.current?.stop();
      setReplacing(false);
    }
  }, [options.blocked]);

  return {
    videoSource:
      replacement?.identity === identity
        ? replacement.url
        : src,

    replacing,
    refreshError: error,

    handleRefreshMetadata: (video: HTMLVideoElement) =>
      runtime.current?.metadata(video) ?? false,

    handleRefreshError: () =>
      runtime.current?.mediaError(),

    stopRefresh: () =>
      runtime.current?.stop(),
  };
}
