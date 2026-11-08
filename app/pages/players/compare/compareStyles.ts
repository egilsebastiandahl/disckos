/**
 * Each side of a comparison keeps one colour across the whole page: A is the theme's green,
 * B the warm accent. Highlights are filled pills, which keep their contrast in both themes.
 */
export const SIDE = {
  a: {
    pill: "bg-primary text-primary-foreground",
    bar: "bg-primary",
    accent: "border-t-primary",
  },
  b: {
    pill: "bg-warm text-warm-foreground",
    bar: "bg-warm",
    accent: "border-t-warm",
  },
} as const;

export type Side = keyof typeof SIDE;

/** "+2", "E", "-1". */
export const formatToPar = (n: number | null | undefined): string => {
  if (n === null || n === undefined) return "–";
  if (n === 0) return "E";
  return n > 0 ? `+${n}` : `${n}`;
};

/** Which side has the better value, or null for a tie / not comparable. */
export const betterSide = (
  a: number | null | undefined,
  b: number | null | undefined,
  better: "lower" | "higher"
): Side | null => {
  if (a === null || a === undefined || b === null || b === undefined) return null;
  const ra = Math.round(a * 10);
  const rb = Math.round(b * 10);
  if (ra === rb) return null;
  return (better === "lower" ? ra < rb : ra > rb) ? "a" : "b";
};
