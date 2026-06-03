import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./index.css";
import "./styles/design-system.css";

// Stale-chunk recovery: when Vite can't fetch a dynamic import after redeployment
// (hash mismatch between cached HTML and new assets), reload to get fresh HTML.
// Guard prevents infinite reload loop if the new chunk also fails to load.
window.addEventListener("vite:preloadError", () => {
  const key = "vite_reload_at";
  const last = sessionStorage.getItem(key);
  if (last && Date.now() - parseInt(last) < 15000) return;
  sessionStorage.setItem(key, String(Date.now()));
  window.location.reload();
});

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <SpeedInsights />
  </>
);
