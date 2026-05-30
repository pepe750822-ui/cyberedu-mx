import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./index.css";
import "./styles/design-system.css";

// Stale-chunk recovery: when Vite can't fetch a dynamic import after redeployment
// (hash mismatch between cached HTML and new assets), reload to get fresh HTML.
window.addEventListener("vite:preloadError", () => {
  window.location.reload();
});

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <SpeedInsights />
  </>
);
