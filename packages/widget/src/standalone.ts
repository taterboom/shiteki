import React from "react";
import { createRoot } from "react-dom/client";
import { ShitekiWidget } from "./components/ShitekiWidget";
import { ShitekiConfig } from "./types";

export function mount(config: ShitekiConfig, el?: HTMLElement) {
  const container = el ?? document.createElement("div");
  if (!el) {
    container.id = "shiteki-widget";
    document.body.appendChild(container);
  }
  const root = createRoot(container);
  root.render(React.createElement(ShitekiWidget, config));
  return root;
}

function autoMount() {
  // document.currentScript is null in ES modules / Vite dev, so query by data attribute
  const script = document.querySelector("script[data-owner][data-repo]") as HTMLScriptElement | null;
  if (!script) return;

  const owner = script.dataset.owner;
  const repo = script.dataset.repo;
  if (!owner || !repo) return;

  const endpoint = script.dataset.endpoint ?? "";
  const githubToken = script.dataset.githubToken ?? "";
  const mode = script.dataset.mode === "direct" ? "direct" as const : "endpoint" as const;
  const labels = script.dataset.labels?.split(",").map((l) => l.trim()).filter(Boolean);
  mount({ mode, endpoint, githubToken, owner, repo, labels });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoMount);
  } else {
    autoMount();
  }
}
