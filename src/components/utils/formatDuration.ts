export function formatDuration(
  duration: string | number | null | undefined,
): string {
  if (duration === null || duration === undefined || duration === "") {
    return "-";
  }

  const minutes = Number.parseInt(String(duration), 10);

  if (!Number.isFinite(minutes) || minutes < 0) {
    return "-";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} menit`;
  }

  if (remainingMinutes === 0) {
    return `${hours} jam`;
  }

  return `${hours} j ${remainingMinutes} m`;
}
