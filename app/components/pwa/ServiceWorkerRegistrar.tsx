"use client";

import { useEffect } from "react";

/** Registers public/sw.js, which receives UDisc files shared to the installed app. */
export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
      // Not fatal: the site works without it, only the share sheet hand-off doesn't.
    });
  }, []);
  return null;
}
