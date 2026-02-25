import React from "react";
import { createRoot } from "react-dom/client";
import { ShijiWidget } from "./components/ShijiWidget";
import { ShijiConfig } from "./types";

export function mount(config: ShijiConfig, el?: HTMLElement) {
  const container = el ?? document.createElement("div");
  if (!el) {
    container.id = "shiji-widget";
    document.body.appendChild(container);
  }
  const root = createRoot(container);
  root.render(React.createElement(ShijiWidget, config));
  return root;
}

// Auto-mount from script data-* attributes
function autoMount() {
  const script = document.currentScript as HTMLScriptElement | null;
  if (!script) return;

  const endpoint = script.dataset.endpoint;
  const owner = script.dataset.owner;
  const repo = script.dataset.repo;
  if (!endpoint || !owner || !repo) return;

  const labels = script.dataset.labels?.split(",").map((l) => l.trim()).filter(Boolean);
  mount({ endpoint, owner, repo, labels });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoMount);
  } else {
    autoMount();
  }
}
