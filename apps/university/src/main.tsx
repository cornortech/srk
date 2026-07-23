import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "sonner";
import App from "./App";
import "./index.css";

// Auth0Provider was removed: `useAuth0` has zero call sites anywhere in this
// app (real auth is the custom useAuthStore/AuthLocalStorage system, used in
// 32 files) — it was dead weight wrapping the entire app, pulling in
// @auth0/auth0-react's bundle cost plus its own mount-time session checks
// for no reason.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <Toaster richColors position="top-center" />
        <App />
      </NextThemesProvider>
    </NextUIProvider>
  </StrictMode>
);
