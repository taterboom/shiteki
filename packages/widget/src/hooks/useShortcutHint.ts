import { useCallback, useState } from "react";

const STORAGE_KEY = "shiteki:shortcut-hint-dismissed";

export function useShortcutHint() {
  const [showHint, setShowHint] = useState(() => {
    try {
      return !localStorage.getItem(STORAGE_KEY);
    } catch {
      return true;
    }
  });

  const dismissHint = useCallback(() => {
    setShowHint(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  }, []);

  return { showHint, dismissHint };
}
