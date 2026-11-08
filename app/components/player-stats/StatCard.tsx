import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  emphasis?: "positive" | "negative" | "neutral";
}

export default function StatCard({
  label,
  value,
  hint,
  emphasis = "neutral",
}: StatCardProps) {
  const valueColor =
    emphasis === "positive"
      ? "text-green-600 dark:text-green-400"
      : emphasis === "negative"
        ? "text-red-600 dark:text-red-400"
        : "";

  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4 shadow-sm">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className={cn("text-2xl font-bold tabular-nums", valueColor)}>
        {value}
      </span>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  );
}
