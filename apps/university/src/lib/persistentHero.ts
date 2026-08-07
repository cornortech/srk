let claimed = false;

// The static hero markup in index.html (id="persistent-hero") is a single,
// self-contained block — image + overlay + text + button, nothing split
// across it and React — living OUTSIDE #root, so React's createRoot()
// (which always tears out and rebuilds #root's contents on mount; this repo
// deliberately doesn't use hydrateRoot, see the comment in main.tsx) never
// touches it. That's what lets the very first paint's hero image stay the
// element the browser's LCP algorithm is tracking, instead of resetting
// when React mounts and would otherwise replace it with a freshly built copy.
//
// Only ever claimed once per page load. Every later mount of IntroSection
// (client-side navigation back to "/") renders normally instead.
export function claimPersistentHero(): boolean {
  if (claimed) return false;
  if (typeof document === "undefined") return false;
  if (!document.getElementById("persistent-hero")) return false;
  claimed = true;
  return true;
}

export function releasePersistentHero(): void {
  document.getElementById("persistent-hero")?.remove();
}
