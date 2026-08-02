import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "sonner";
import App from "./App";
import "./index.css";

// Auth0Provider was removed: `useAuth0` has zero call sites anywhere in this
// app (real auth is the custom useAuthStore/AuthLocalStorage system, used in
// 32 files) — it was dead weight wrapping the entire app, pulling in
// @auth0/auth0-react's bundle cost plus its own mount-time session checks
// for no reason.
//
// NextThemesProvider was removed the same way: nothing in this app ever
// calls useTheme()/setTheme() — there's no light/dark toggle anywhere, the
// theme is permanently "dark" (see the hardcoded `class="dark"` on <html> in
// index.html, which now does statically what this provider used to do at
// runtime).
//
// `createRoot` (not `hydrateRoot`) is intentional: `scripts/prerender-university-simple.ts`
// bakes real HTML into `#root` for SEO/AdSense crawlability, but this app has
// no true SSR pipeline, so nothing guarantees the first client render matches
// that snapshot byte-for-byte. NextUIProvider's react-aria internals mint
// `useId()`-based ids for every interactive element, and those ids depend on
// component mount order/count — which differs between Puppeteer's prerender
// pass and a fresh page load. `hydrateRoot` was tried and reliably hit React
// error #418/#423 (hydration mismatch) on every route, and recovers by
// discarding and re-rendering the whole tree anyway — so it bought nothing
// over `createRoot` while adding a failed diff pass and console errors.
// Fixing this for real means either replacing NextUI's id generation or a
// genuine SSR migration; both are out of scope here.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NextUIProvider>
      <Toaster richColors position="top-center" />
      <App />
    </NextUIProvider>
  </StrictMode>
);
