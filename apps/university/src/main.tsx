import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Auth0Provider } from "@auth0/auth0-react";
import { Toaster } from "sonner";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <Auth0Provider
          domain="dev-ljdkfi6gympigf3d.us.auth0.com"
          clientId="p2bzemHZ6PUAeCrLDbXBv825shWbocV9"
          authorizationParams={{
            redirect_uri: window.location.origin,
          }}
        >
          <Toaster richColors position="top-center" />
          <App />
        </Auth0Provider>
      </NextThemesProvider>
    </NextUIProvider>
  </StrictMode>
);
