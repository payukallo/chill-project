const R2_IMAGES_PUBLIC_URL = "https://pub-d8b01ec688d74fb99fb239f70969af65.r2.dev";

const IMAGE_EXTENSIONS = new Set([
  "jpg", "jpeg", "png", "webp",
  "avif", "svg", "gif", "ico",
]);

export function resolveImageUrl<T extends string | null | undefined>(
  value: T,
): T {
  if (typeof value !== "string" || !value.trim()) {
    return value;
  }

  const raw = value.trim();
  const lower = raw.toLowerCase();

  if (
    lower.startsWith("https://") ||
    lower.startsWith("http://") ||
    raw.startsWith("//")
  ) {
    return value;
  }

  let key = raw;

  while (key.startsWith("/")) {
    key = key.slice(1);
  }

  if (!key.startsWith("images/")) {
    return value;
  }

  const extension =
    key.split(".").pop()?.toLowerCase();

  if (!extension || !IMAGE_EXTENSIONS.has(extension)) {
    return value;
  }

  if (
    key.split("/").some(
      part => !part || part === "." || part === ".."
    )
  ) {
    return value;
  }

  return (
    R2_IMAGES_PUBLIC_URL + "/" +
    key.split("/").map(encodeURIComponent).join("/")
  ) as T;
}
