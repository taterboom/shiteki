import { useCallback, useState } from "react";
import { ShitekiConfig } from "../types";

const STORAGE_KEY = "shiteki:config";

function readStored(): Partial<ShitekiConfig> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function merge(defaults: ShitekiConfig, stored: Partial<ShitekiConfig> | null): ShitekiConfig {
  if (!stored) return defaults;
  return {
    mode: stored.mode || defaults.mode,
    endpoint: stored.endpoint || defaults.endpoint,
    githubToken: stored.githubToken || defaults.githubToken,
    owner: stored.owner || defaults.owner,
    repo: stored.repo || defaults.repo,
    labels: stored.labels ?? defaults.labels,
    clearAfterCopy: stored.clearAfterCopy ?? defaults.clearAfterCopy,
  };
}

export function useConfig(defaults: ShitekiConfig) {
  const [config, setConfig] = useState<ShitekiConfig>(() => merge(defaults, readStored()));

  const updateConfig = useCallback(
    (partial: Partial<ShitekiConfig>) => {
      setConfig((prev) => {
        const next = { ...prev, ...partial };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // storage full — silently ignore
        }
        return next;
      });
    },
    []
  );

  return { config, updateConfig };
}
