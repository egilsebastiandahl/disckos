/**
 * Fly a disc from one element into a basket that pops up on the target element.
 *
 * Sequence:
 *   1. Spawn a basket SVG over the target, fade it in.
 *   2. Spawn a disc at the `from` element, fly it along a curved zig-zag path
 *      (perpendicular wobble at multiple offsets, with a slight overall arc).
 *   3. Disc settles into the basket on impact.
 *   4. Basket gives a quick wobble, then both fade out.
 *
 * Respects prefers-reduced-motion (calls onComplete immediately and skips animation).
 */
export interface FlyDiscToBasketOptions {
  from: HTMLElement;
  to: HTMLElement;
  flightMs?: number;
  basketHoldMs?: number;
  discSize?: number;
  basketSize?: number;
  onComplete?: () => void;
}

export function flyDiscToBasket({
  from,
  to,
  flightMs = 1400,
  basketHoldMs = 500,
  discSize = 36,
  basketSize = 110,
  onComplete,
}: FlyDiscToBasketOptions): void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    onComplete?.();
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    onComplete?.();
    return;
  }

  const fromRect = from.getBoundingClientRect();
  const toRect = to.getBoundingClientRect();

  const startX = fromRect.left + fromRect.width / 2 + window.scrollX;
  const startY = fromRect.top + fromRect.height / 2 + window.scrollY;
  const endX = toRect.left + toRect.width / 2 + window.scrollX;
  const endY = toRect.top + toRect.height / 2 + window.scrollY;

  // ── Basket ──────────────────────────────────────────────────────────────
  const basket = document.createElement("div");
  basket.setAttribute("aria-hidden", "true");
  basket.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: ${basketSize}px;
    height: ${basketSize}px;
    pointer-events: none;
    z-index: 50;
    transform: translate(${endX - basketSize / 2}px, ${endY - basketSize / 2}px);
    opacity: 0;
    will-change: transform, opacity;
  `;
  basket.innerHTML = basketSvg(basketSize);
  document.body.appendChild(basket);

  // Pop-in
  basket.animate(
    [
      { opacity: 0, transform: `translate(${endX - basketSize / 2}px, ${endY - basketSize / 2 + 14}px) scale(0.6)` },
      { opacity: 1, transform: `translate(${endX - basketSize / 2}px, ${endY - basketSize / 2}px) scale(1)` },
    ],
    {
      duration: 280,
      easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      fill: "forwards",
    },
  );

  // ── Disc ────────────────────────────────────────────────────────────────
  const disc = document.createElement("div");
  disc.setAttribute("aria-hidden", "true");
  disc.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: ${discSize}px;
    height: ${discSize}px;
    pointer-events: none;
    z-index: 60;
    will-change: transform, opacity;
    transform: translate(${startX - discSize / 2}px, ${startY - discSize / 2}px);
  `;
  disc.innerHTML = discSvg(discSize);
  document.body.appendChild(disc);

  // Zig-zag waypoints: offset perpendicular to the start→end vector,
  // alternating sides for the wobble, plus a gentle overall vertical arc.
  const dx = endX - startX;
  const dy = endY - startY;
  const distance = Math.max(Math.hypot(dx, dy), 1);
  const perpX = -dy / distance;
  const perpY = dx / distance;
  const wobbleAmp = Math.min(distance * 0.18, 140);
  const arcLift = Math.min(distance * 0.15, 90);

  const wp = (t: number, side: number) => {
    // Linear progress along the straight line
    const lx = startX + dx * t;
    const ly = startY + dy * t;
    // Perpendicular zig-zag offset
    const ox = perpX * wobbleAmp * side;
    const oy = perpY * wobbleAmp * side;
    // Overall arc (sin curve peaks at midpoint)
    const lift = -arcLift * Math.sin(t * Math.PI);
    return { x: lx + ox, y: ly + oy + lift };
  };

  const w1 = wp(0.22, 1); // up-right of line
  const w2 = wp(0.42, -1); // down-left
  const w3 = wp(0.62, 1); // up-right
  const w4 = wp(0.82, -1); // down-left

  const tx = (x: number) => x - discSize / 2;
  const ty = (y: number) => y - discSize / 2;

  const discAnim = disc.animate(
    [
      {
        transform: `translate(${tx(startX)}px, ${ty(startY)}px) rotate(0deg) scale(0.7)`,
        opacity: 0,
      },
      {
        transform: `translate(${tx(startX)}px, ${ty(startY)}px) rotate(60deg) scale(1)`,
        opacity: 1,
        offset: 0.06,
      },
      {
        transform: `translate(${tx(w1.x)}px, ${ty(w1.y)}px) rotate(280deg) scale(1.05)`,
        offset: 0.22,
      },
      {
        transform: `translate(${tx(w2.x)}px, ${ty(w2.y)}px) rotate(500deg) scale(1.05)`,
        offset: 0.42,
      },
      {
        transform: `translate(${tx(w3.x)}px, ${ty(w3.y)}px) rotate(720deg) scale(1.05)`,
        offset: 0.62,
      },
      {
        transform: `translate(${tx(w4.x)}px, ${ty(w4.y)}px) rotate(940deg) scale(1.05)`,
        offset: 0.82,
      },
      {
        transform: `translate(${tx(endX)}px, ${ty(endY - basketSize * 0.08)}px) rotate(1140deg) scale(0.9)`,
        offset: 0.95,
      },
      {
        transform: `translate(${tx(endX)}px, ${ty(endY)}px) rotate(1200deg) scale(0.45)`,
        opacity: 0,
      },
    ],
    {
      duration: flightMs,
      easing: "cubic-bezier(0.45, 0.05, 0.55, 1)",
      fill: "forwards",
    },
  );

  discAnim.addEventListener("finish", () => {
    disc.remove();

    // Basket wobble on impact
    basket.animate(
      [
        { transform: `translate(${endX - basketSize / 2}px, ${endY - basketSize / 2}px) rotate(0deg)` },
        { transform: `translate(${endX - basketSize / 2 - 2}px, ${endY - basketSize / 2 + 1}px) rotate(-2deg)`, offset: 0.25 },
        { transform: `translate(${endX - basketSize / 2 + 2}px, ${endY - basketSize / 2}px) rotate(2deg)`, offset: 0.5 },
        { transform: `translate(${endX - basketSize / 2 - 1}px, ${endY - basketSize / 2}px) rotate(-1deg)`, offset: 0.75 },
        { transform: `translate(${endX - basketSize / 2}px, ${endY - basketSize / 2}px) rotate(0deg)` },
      ],
      { duration: 320, easing: "ease-out", fill: "forwards" },
    );

    // Hold, then fade out the basket
    window.setTimeout(() => {
      const fadeOut = basket.animate(
        [
          { opacity: 1, transform: `translate(${endX - basketSize / 2}px, ${endY - basketSize / 2}px) scale(1)` },
          { opacity: 0, transform: `translate(${endX - basketSize / 2}px, ${endY - basketSize / 2 - 8}px) scale(0.92)` },
        ],
        { duration: 320, easing: "ease-in", fill: "forwards" },
      );
      fadeOut.addEventListener("finish", () => {
        basket.remove();
        onComplete?.();
      });
    }, basketHoldMs);
  });

  discAnim.addEventListener("cancel", () => {
    disc.remove();
    basket.remove();
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

function basketSvg(size: number): string {
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
      <g fill="var(--muted-foreground, #6F6A5F)">
        <ellipse cx="50" cy="94" rx="22" ry="2.5" opacity="0.18" />
        <rect x="48" y="55" width="4" height="38" opacity="0.55" />
        <ellipse cx="50" cy="22" rx="14" ry="3" opacity="0.65" />
        <rect x="49" y="20" width="2" height="6" opacity="0.65" />
        <path d="M28 56 Q50 52 72 56 L68 70 Q50 73 32 70 Z" opacity="0.55" />
        <ellipse cx="50" cy="56" rx="22" ry="3" opacity="0.7" />
      </g>
      <g stroke="var(--muted-foreground, #6F6A5F)" stroke-width="0.8" stroke-dasharray="2 1.5" opacity="0.55">
        <line x1="28" y1="24" x2="43.4" y2="56" />
        <line x1="38" y1="24" x2="46.4" y2="56" />
        <line x1="50" y1="24" x2="50" y2="56" />
        <line x1="62" y1="24" x2="53.6" y2="56" />
        <line x1="72" y1="24" x2="56.6" y2="56" />
      </g>
      <ellipse cx="50" cy="56" rx="22" ry="3" fill="none" stroke="var(--muted-foreground, #6F6A5F)" stroke-width="0.6" opacity="0.8" />
    </svg>
  `;
}
