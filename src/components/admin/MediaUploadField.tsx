import { useEffect, useRef, useState } from "react";

import {
  uploadAdminMedia,
  validateUploadFile,
  getUploadError,
  uploadRules,
} from "../../services/adminUploadService";

import type {
  UploadKind,
} from "../../services/adminUploadService";

interface Props {
  kind: UploadKind;
  value: string;
  disabled: boolean;
  onChange: (key: string) => void;
  onBusyChange: (busy: boolean) => void;
  beginUpload: () => boolean;
}

export function MediaUploadField({
  kind,
  value,
  disabled,
  onChange,
  onBusyChange,
  beginUpload,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [successKey, setSuccessKey] = useState("");

  const controller = useRef<AbortController | null>(
    null,
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file || kind !== "image") {
      return;
    }

    const url = URL.createObjectURL(file);

    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file, kind]);

  useEffect(() => {
    return () => {
      controller.current?.abort();
    };
  }, []);

  const handleUpload = async () => {
    if (!file || disabled || controller.current) {
      return;
    }

    if (!beginUpload()) return;

    const active = new AbortController();

    controller.current = active;

    setBusy(true);
    setError("");
    setSuccessKey("");
    setProgress(0);

    try {
      const key = await uploadAdminMedia(
        file,
        kind,
        setProgress,
        active.signal,
      );

      if (active.signal.aborted) return;

      onChange(key);
      setSuccessKey(key);
      setFile(null);
      setPreview("");

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (err) {
      setError(
        active.signal.aborted
          ? "Upload dibatalkan"
          : getUploadError(err),
      );
    } finally {
      controller.current = null;
      setBusy(false);
      onBusyChange(false);
    }
  };

  const rule = uploadRules[kind];

  return (
    <div className="admin-media-upload">
      <input
        ref={inputRef}
        type="file"
        accept={rule.types.join(",")}
        disabled={disabled || busy}
        aria-label={
          kind === "image"
            ? "Pilih gambar"
            : "Pilih video"
        }
        onChange={(event) => {
          const selected = event.target.files?.[0];

          setFile(null);
          setPreview("");
          setError("");
          setSuccessKey("");
          setProgress(0);

          if (!selected) return;

          try {
            validateUploadFile(selected, kind);
            setFile(selected);
          } catch (err) {
            setError(getUploadError(err));
            event.target.value = "";
          }
        }}
      />

      <small>
        {kind === "image"
          ? "JPG, PNG, WebP, AVIF"
          : "MP4, WebM"}
        {" · Maks. "}
        {rule.maxSize / (1024 * 1024)} MiB
      </small>

      {file && kind === "image" && preview && (
        <img
          className="admin-upload-preview"
          src={preview}
          alt="Preview media upload"
        />
      )}

      {file && (
        <small>
          {file.name} ·{" "}
          {(file.size / (1024 * 1024)).toFixed(2)} MiB
        </small>
      )}

      {file && !busy && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => void handleUpload()}
        >
          Upload ke R2
        </button>
      )}

      {busy && (
        <>
          <progress value={progress} max={100} />

          <small>
            {progress >= 99
              ? "Memverifikasi upload..."
              : `Uploading ${progress}%`}
          </small>

          <button
            type="button"
            onClick={() => controller.current?.abort()}
          >
            Batalkan Upload
          </button>
        </>
      )}

      {successKey && successKey === value && (
        <small role="status" className="upload-success">
          Upload berhasil diverifikasi.
        </small>
      )}

      {error && (
        <small role="alert" className="upload-error">
          {error}
        </small>
      )}
    </div>
  );
}
