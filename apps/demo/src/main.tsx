import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { LiquidGlassApp } from "./LiquidGlass";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <LiquidGlassApp /> */}
    <App />
  </StrictMode>
);
