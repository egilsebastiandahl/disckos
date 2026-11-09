/**
 * Theme colours for Recharts tooltips. Recharts' default white box shows the label in the
 * page's light text on dark mode.
 */
export const chartTooltipStyle = {
  contentStyle: {
    backgroundColor: "var(--popover)",
    borderColor: "var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--popover-foreground)",
  },
  labelStyle: { color: "var(--popover-foreground)", fontWeight: 500 },
  itemStyle: { color: "var(--popover-foreground)" },
  cursor: { stroke: "var(--muted-foreground)", strokeOpacity: 0.5 },
} as const;
