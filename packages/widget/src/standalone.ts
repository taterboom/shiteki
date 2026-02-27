import React from "react";
import { createRoot } from "react-dom/client";
import { ShitekiWidget } from "./components/ShitekiWidget";
import { ShitekiConfig } from "./types";

export function mount(config?: Partial<ShitekiConfig>, el?: HTMLElement) {
  const container = el ?? document.createElement("div");
  if (!el) {
    container.id = "shiteki-widget";
    document.body.appendChild(container);
  }
  const fullConfig: ShitekiConfig = {
    mode: "endpoint",
    endpoint: "",
    githubToken: "",
    owner: "",
    repo: "",
    ...config,
  };
  const root = createRoot(container);
  root.render(React.createElement(ShitekiWidget, fullConfig));
  return root;
}

function autoMount() {
  const script = document.querySelector("script[data-shiteki]") as HTMLScriptElement | null;
  if (!script) return;

  const raw = script.getAttribute("data-shiteki") || "{}";
  let config: Partial<ShitekiConfig> = {};
  try {
    config = JSON.parse(raw);
  } catch {
    // invalid JSON — mount with defaults
  }
  mount(config);
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoMount);
  } else {
    autoMount();
  }
}
