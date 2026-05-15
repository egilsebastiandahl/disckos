import { cn } from "@/lib/utils";
import DiscIcon from "./DiscIcon";
import "./animations.css";

interface DiscInBasketProps {
  className?: string;
  size?: number;
}

/**
 * Looping disc-into-basket animation for empty states.
 * Calm enough to leave on screen — fires once every ~3.6s.
 */
export default function DiscInBasket({ className, size = 120 }: DiscInBasketProps) {
  return (
    <div
      className={cn("relative inline-block", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* Basket */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 text-muted-foreground/70"
        fill="none"
      >
        {/* Pole */}
        <rect x="48" y="55" width="4" height="38" fill="currentColor" opacity="0.55" />
        {/* Ground shadow */}
        <ellipse cx="50" cy="94" rx="22" ry="2.5" fill="currentColor" opacity="0.18" />
        {/* Top deflector */}
        <ellipse cx="50" cy="22" rx="14" ry="3" fill="currentColor" opacity="0.65" />
        <rect x="49" y="20" width="2" height="6" fill="currentColor" opacity="0.65" />
        {/* Chains */}
        <g className="chains-rattle">
          {[28, 38, 50, 62, 72].map((x) => (
            <line
              key={x}
              x1={x}
              y1="24"
              x2={50 + (x - 50) * 0.3}
              y2="56"
              stroke="currentColor"
              strokeWidth="0.8"
              strokeDasharray="2 1.5"
              opacity="0.55"
            />
          ))}
        </g>
        {/* Basket tray */}
        <path
          d="M28 56 Q50 52 72 56 L68 70 Q50 73 32 70 Z"
          fill="currentColor"
          opacity="0.55"
        />
        <ellipse cx="50" cy="56" rx="22" ry="3" fill="currentColor" opacity="0.7" />
        {/* Basket rim highlight */}
        <ellipse
          cx="50"
          cy="56"
          rx="22"
          ry="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity="0.8"
        />
      </svg>

      {/* Flying disc */}
      <div
        className="disc-into-basket absolute will-change-transform"
        style={{
          top: "38%",
          left: "50%",
          marginLeft: -size * 0.12,
        }}
      >
        <DiscIcon size={size * 0.24} />
      </div>
    </div>
  );
}
