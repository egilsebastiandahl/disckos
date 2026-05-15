import { cn } from "@/lib/utils";

interface DiscIconProps {
  className?: string;
  size?: number;
}

export default function DiscIcon({ className, size = 24 }: DiscIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("text-primary", className)}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="disc-shine" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="white" stopOpacity="0.45" />
          <stop offset="55%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="11" fill="currentColor" />
      <circle
        cx="12"
        cy="12"
        r="11"
        fill="url(#disc-shine)"
      />
      <circle
        cx="12"
        cy="12"
        r="8.5"
        fill="none"
        stroke="white"
        strokeOpacity="0.25"
        strokeWidth="0.5"
      />
      <circle
        cx="12"
        cy="12"
        r="5"
        fill="none"
        stroke="white"
        strokeOpacity="0.3"
        strokeWidth="0.5"
      />
      <circle cx="12" cy="12" r="1.5" fill="white" fillOpacity="0.55" />
    </svg>
  );
}
