"use client";

import { useEffect, useState } from "react";
import DiscIcon from "./DiscIcon";
import "./animations.css";

const SESSION_KEY = "disckos-hero-arc-seen";
const ANIMATION_MS = 2600;

export default function HeroDiscArc() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");
    // Intentional client-only mount gate. The check depends on browser APIs that
    // don't exist during SSR, so the first client commit must match SSR (null)
    // and we flip to true post-hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRun(true);
    const timer = window.setTimeout(() => setRun(false), ANIMATION_MS + 100);
    return () => window.clearTimeout(timer);
  }, []);

  if (!run) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
      aria-hidden="true"
    >
      <div className="disc-hero-arc absolute top-0 left-0 will-change-transform">
        <DiscIcon size={56} className="drop-shadow-lg" />
      </div>
    </div>
  );
}
