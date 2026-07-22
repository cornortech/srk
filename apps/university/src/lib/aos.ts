import { useEffect } from "react";

declare global {
  interface Window {
    AOS?: {
      init: (opts?: Record<string, unknown>) => void;
      refresh: () => void;
      refreshHard: () => void;
    };
  }
}

let aosPromise: Promise<void> | null = null;

// Loads the AOS (Animate On Scroll) library on demand instead of on every
// page load, since it's only needed by pages/sections that render
// data-aos elements. Idempotent: safe to call from many components.
function loadAOS(): Promise<void> {
  if (aosPromise) return aosPromise;

  aosPromise = new Promise((resolve) => {
    if (!document.querySelector('link[href*="aos"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/aos@next/dist/aos.css";
      document.head.appendChild(link);
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/aos@next/dist/aos.js";
    script.onload = () => {
      window.AOS?.init();
      resolve();
    };
    document.body.appendChild(script);
  });

  return aosPromise;
}

export function useAOS() {
  useEffect(() => {
    loadAOS().then(() => {
      window.AOS?.refreshHard();
    });
  }, []);
}
