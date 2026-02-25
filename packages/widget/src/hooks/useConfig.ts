import { useCallback, useState } from "react";
import { ShijiConfig } from "../types";

const STORAGE_KEY = "shiji:config";

function readStored(): Partial<ShijiConfig> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function merge(defaults: ShijiConfig, stored: Partial<ShijiConfig> | null): ShijiConfig {
  if (!stored) return defaults;
  return {
    mode: stored.mode || defaults.mode,
    endpoint: stored.endpoint || defaults.endpoint,
    githubToken: stored.githubToken || defaults.githubToken,
    owner: stored.owner || defaults.owner,
    repo: stored.repo || defaults.repo,
    labels: stored.labels ?? defaults.labels,
  };
}

export function useConfig(defaults: ShijiConfig) {
  const [config, setConfig] = useState<ShijiConfig>(() => merge(defaults, readStored()));

  const updateConfig = useCallback(
    (partial: Partial<ShijiConfig>) => {
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
