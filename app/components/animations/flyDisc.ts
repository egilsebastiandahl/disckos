/**
 * Fly a disc visually from one element to another using the Web Animations API.
 * Spawns a disc node on document.body, animates along an arced path, removes itself.
 * Respects prefers-reduced-motion (calls onArrive immediately and skips animation).
 */
export interface FlyDiscOptions {
  from: HTMLElement;
  to: HTMLElement;
  durationMs?: number;
  size?: number;
  onArrive?: () => void;
}

export function flyDisc({
  from,
  to,
  durationMs = 900,
  size = 36,
  onArrive,
}: FlyDiscOptions): void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    onArrive?.();
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    onArrive?.();
    return;
  }

  const fromRect = from.getBoundingClientRect();
  const toRect = to.getBoundingClientRect();

  const startX = fromRect.left + fromRect.width / 2 + window.scrollX;
  const startY = fromRect.top + fromRect.height / 2 + window.scrollY;
  const endX = toRect.left + toRect.width / 2 + window.scrollX;
  const endY = toRect.top + toRect.height / 2 + window.scrollY;

  const node = document.createElement("div");
  node.setAttribute("aria-hidden", "true");
  node.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: ${size}px;
    height: ${size}px;
    pointer-events: none;
    z-index: 60;
    will-change: transform;
    transform: translate(${startX - size / 2}px, ${startY - size / 2}px);
  `;
  node.innerHTML = discSvg(size);
  document.body.appendChild(node);

  // Arc apex: 30% of the vertical distance above the midpoint, biased upward.
  const midX = (startX + endX) / 2;
  const midY = Math.min(startY, endY) - Math.abs(endY - startY) * 0.3 - 60;

  const animation = node.animate(
    [
      {
        transform: `translate(${startX - size / 2}px, ${startY - size / 2}px) rotate(0deg) scale(0.7)`,
        opacity: 0,
      },
      {
        transform: `translate(${startX - size / 2}px, ${startY - size / 2}px) rotate(45deg) scale(1)`,
        opacity: 1,
        offset: 0.08,
      },
      {
        transform: `translate(${midX - size / 2}px, ${midY - size / 2}px) rotate(540deg) scale(1.05)`,
        opacity: 1,
        offset: 0.5,
      },
      {
        transform: `translate(${endX - size / 2}px, ${endY - size / 2}px) rotate(1080deg) scale(0.85)`,
        opacity: 1,
        offset: 0.92,
      },
      {
        transform: `translate(${endX - size / 2}px, ${endY - size / 2}px) rotate(1140deg) scale(0.6)`,
        opacity: 0,
      },
    ],
    {
      duration: durationMs,
      easing: "cubic-bezier(0.33, 0.05, 0.5, 1)",
      fill: "forwards",
    },
  );

  animation.addEventListener("finish", () => {
    node.remove();
    onArrive?.();
  });
  animation.addEventListener("cancel", () => {
    node.remove();
  });
}

function discSvg(size: number): string {
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="fd-shine" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stop-color="white" stop-opacity="0.45" />
          <stop offset="55%" stop-color="white" stop-opacity="0" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="11" fill="var(--primary, #5F7D4D)" />
      <circle cx="12" cy="12" r="11" fill="url(#fd-shine)" />
      <circle cx="12" cy="12" r="8.5" fill="none" stroke="white" stroke-opacity="0.25" stroke-width="0.5" />
      <circle cx="12" cy="12" r="5" fill="none" stroke="white" stroke-opacity="0.3" stroke-width="0.5" />
      <circle cx="12" cy="12" r="1.5" fill="white" fill-opacity="0.55" />
    </svg>
  `;
}
