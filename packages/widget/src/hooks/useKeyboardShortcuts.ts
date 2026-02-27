import { useEffect, useRef } from "react";
import { WidgetMode } from "../types";

interface UseKeyboardShortcutsOptions {
  open: boolean;
  mode: WidgetMode;
  annotationCount: number;
  canSend: boolean;
  settingsOpen: boolean;
  sendDialogOpen: boolean;
  onCopy: () => void;
  onSend: () => void;
  onClear: () => void;
  onToggleOpen: () => void;
  onClose: () => void;
  onCancelAnnotation: () => void;
  onCloseSettings: () => void;
  onCloseSendDialog: () => void;
}

function isInputTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return false;
}

const DOUBLE_TAP_THRESHOLD = 300;

export function useKeyboardShortcuts(opts: UseKeyboardShortcutsOptions) {
  const lastDRef = useRef(0);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // "x" toggles toolbar open/close (global, works even when closed)
      if (e.key.toLowerCase() === "x" && !isInputTarget(e.target)) {
        e.preventDefault();
        opts.onToggleOpen();
        return;
      }

      if (!opts.open) return;

      // Escape: close layers in order
      if (e.key === "Escape") {
        e.preventDefault();
        if (opts.mode === "annotating") {
          opts.onCancelAnnotation();
        } else if (opts.sendDialogOpen) {
          opts.onCloseSendDialog();
        } else if (opts.settingsOpen) {
          opts.onCloseSettings();
        } else {
          opts.onClose();
        }
        return;
      }

      // Skip shortcuts when typing in inputs
      if (isInputTarget(e.target)) return;

      const key = e.key.toLowerCase();

      if (key === "c" && opts.annotationCount > 0) {
        e.preventDefault();
        opts.onCopy();
      } else if (key === "s" && opts.annotationCount > 0 && opts.canSend) {
        e.preventDefault();
        opts.onSend();
      } else if (key === "d" && opts.annotationCount > 0) {
        const now = Date.now();
        if (now - lastDRef.current < DOUBLE_TAP_THRESHOLD) {
          e.preventDefault();
          opts.onClear();
          lastDRef.current = 0;
        } else {
          lastDRef.current = now;
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    opts.open,
    opts.mode,
    opts.annotationCount,
    opts.canSend,
    opts.settingsOpen,
    opts.sendDialogOpen,
    opts.onCopy,
    opts.onSend,
    opts.onClear,
    opts.onToggleOpen,
    opts.onClose,
    opts.onCancelAnnotation,
    opts.onCloseSettings,
    opts.onCloseSendDialog,
  ]);
}
