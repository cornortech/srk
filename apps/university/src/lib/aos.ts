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

  // Skip entirely during the prerender crawl (scripts/prerender-university-simple.ts
  // uses Puppeteer, which sets navigator.webdriver): that script waits for the
  // page to fully settle before capturing HTML, so anything loaded here would
  // get baked into the static snapshot in its already-loaded state — defeating
  // the deferral for every real visitor who receives that snapshot. Skipping
  // it means the prerendered page has no AOS at all, and every real visitor
  // still gets it loaded fresh, properly deferred, on their own page load.
  if (navigator.webdriver) {
    aosPromise = Promise.resolve();
    return aosPromise;
  }

  aosPromise = new Promise((resolve) => {
    if (!document.querySelector('link[href*="aos"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/aos@next/dist/aos.css";
      // Load non-blocking (same media=print swap trick as a static link tag):
      // this element gets captured verbatim into the prerendered HTML
      // snapshot (scripts/prerender-university-simple.ts), so on a real
      // visitor's *next* load it exists as a plain <link> from the start —
      // without this it would render-block every prerendered page.
      link.media = "print";
      link.onload = () => {
        link.media = "all";
      };
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
