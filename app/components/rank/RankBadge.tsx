import { cn } from "@/lib/utils";
import { type RankTier } from "@/app/types/course-rank.model";
import { rankGroupStyles } from "./rankStyles";

const SIZES = { sm: 34, md: 60, lg: 84 } as const;

interface RankBadgeProps {
  /** Null shows the "unranked" medallion. */
  tier: RankTier | null;
  size?: keyof typeof SIZES;
  /** Unranked only: placement rounds played so far, out of [placementTotal]. */
  placementDone?: number;
  placementTotal?: number;
  className?: string;
}

/**
 * A disc-shaped medallion: the group's colour and icon in the middle, and pips along the
 * bottom rim for the step within the group (Chain Master II = two of three lit).
 */
export default function RankBadge({
  tier,
  size = "md",
  placementDone = 0,
  placementTotal = 0,
  className,
}: RankBadgeProps) {
  const px = SIZES[size];

  if (!tier) {
    return (
      <div
        className={cn("relative inline-flex shrink-0", className)}
        style={{ width: px, height: px }}
        title="Uplassert"
        aria-label="Uplassert"
      >
        <div className="flex size-full items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/40 bg-muted">
          <span
            className="font-serif font-bold text-muted-foreground"
            style={{ fontSize: px * 0.4 }}
          >
            ?
          </span>
        </div>
        {placementTotal > 0 && (
          <Pips
            lit={placementDone}
            total={placementTotal}
            px={px}
            litColor="var(--primary)"
            unlitColor="var(--muted-foreground)"
            background="var(--muted)"
          />
        )}
      </div>
    );
  }

  const style = rankGroupStyles[tier.group];
  const Icon = style.icon;

  return (
    <div
      className={cn("relative inline-flex shrink-0", className)}
      style={{ width: px, height: px }}
      title={tier.name}
      aria-label={tier.name}
    >
      <div
        className="flex size-full items-center justify-center rounded-full"
        style={{
          background: `linear-gradient(150deg, ${style.light}, ${style.dark})`,
          boxShadow: [
            `inset 0 0 0 ${Math.max(2, px * 0.045)}px ${style.rim}`,
            "0 2px 6px rgba(0,0,0,0.25)",
            style.glow ? `0 0 ${px * 0.3}px ${style.glow}` : null,
          ]
            .filter(Boolean)
            .join(", "),
        }}
      >
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: px * 0.66,
            height: px * 0.66,
            background: `radial-gradient(circle at 35% 30%, ${style.light}, ${style.dark} 75%)`,
            boxShadow: "inset 0 1px 4px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.25)",
          }}
        >
          <Icon
            color={style.ink}
            size={px * 0.34}
            strokeWidth={size === "sm" ? 2.5 : 2.25}
            aria-hidden
          />
        </div>
      </div>
      {tier.levelsInGroup > 1 && (
        <Pips
          lit={tier.level}
          total={tier.levelsInGroup}
          px={px}
          litColor={style.rim}
          unlitColor="rgba(255,255,255,0.35)"
          background={style.dark}
        />
      )}
    </div>
  );
}

function Pips({
  lit,
  total,
  px,
  litColor,
  unlitColor,
  background,
}: {
  lit: number;
  total: number;
  px: number;
  litColor: string;
  unlitColor: string;
  background: string;
}) {
  const dot = Math.max(4, Math.round(px * 0.1));
  return (
    <div
      className="absolute left-1/2 flex -translate-x-1/2 items-center rounded-full px-1 py-0.5 shadow-sm"
      style={{ bottom: -dot * 0.6, gap: Math.max(2, dot * 0.4), background }}
      aria-hidden
    >
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="rounded-full"
          style={{
            width: dot,
            height: dot,
            background: i < lit ? litColor : "transparent",
            boxShadow: i < lit ? "none" : `inset 0 0 0 1px ${unlitColor}`,
          }}
        />
      ))}
    </div>
  );
}
