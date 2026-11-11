/** Small formatting helpers shared by member uploads and confirmations. */

export const formatToPar = (n: number): string => (n === 0 ? "E" : n > 0 ? `+${n}` : `${n}`);

export const toParClass = (n: number): string =>
  n < 0 ? "text-green-600 dark:text-green-400" : n > 0 ? "text-red-600 dark:text-red-400" : "";

export const formatPlayed = (iso: string | null): string =>
  iso
    ? new Date(iso).toLocaleString("no", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "Ukjent tidspunkt";

/** Course, with the UDisc layout when there is one. */
export const courseLabel = (location: string | null, layout: string | null): string =>
  [location ?? "Ukjent bane", layout].filter(Boolean).join(" · ");
