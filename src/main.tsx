import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./index.css";
import "./styles/design-system.css";

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <SpeedInsights />
  </>
);
