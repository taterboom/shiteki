import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { spring } from "../utils/spring";

interface ToolbarProps {
  open: boolean;
  annotationCount: number;
  copied: boolean;
  sending: boolean;
  settingsOpen: boolean;
  onOpen: () => void;
  onCopy: () => void;
  onSend: () => void;
  onClear: () => void;
  onSettings: () => void;
  onClose: () => void;
  showHint: boolean;
  onDismissHint: () => void;
}

export function Toolbar({
  open,
  annotationCount,
  copied,
  sending,
  settingsOpen,
  onOpen,
  onCopy,
  onSend,
  onClear,
  onSettings,
  onClose,
  showHint,
  onDismissHint,
}: ToolbarProps) {

  return (
    <motion.div
      layout
      className="shiteki-toolbar"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        gap: open ? 4 : 0,
        padding: "6px",
        background: open
          ? "#ffffff"
          : "rgb(37, 99, 235)",
        borderColor: open
          ? "#e5e7eb"
          : "transparent",
        boxShadow: open
          ? "0 4px 12px rgba(0, 0, 0, 0.08)"
          : "0 2px 16px rgba(37, 99, 235, 0.3)",
      }}
      transition={spring}
      onClick={!open ? onOpen : undefined}
      role={!open ? "button" : undefined}
      aria-label={!open ? "Open Shiteki" : undefined}
      style={{ cursor: !open ? "pointer" : undefined }}
      whileHover={!open ? { scale: 1.08, boxShadow: "0 4px 20px rgba(37, 99, 235, 0.4)" } : undefined}
      whileTap={!open ? { scale: 0.95 } : undefined}
    >
      {/* Crosshair icon with badge */}
      <div className="shiteki-toolbar-picker">
        <motion.div
          className={`shiteki-toolbar-btn ${open ? "shiteki-toolbar-btn--active" : ""}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={!open ? { color: "#fff", pointerEvents: "none" } : { pointerEvents: "none" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="2" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
          </svg>
        </motion.div>
        {open && annotationCount > 0 && (
          <motion.span
            className="shiteki-toolbar-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={spring}
          >
            {annotationCount}
          </motion.span>
        )}
      </div>

      {/* Expandable section */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="expand"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={spring}
            style={{ overflow: "hidden", display: "flex", alignItems: "center", gap: 4 }}
          >
            {/* Separator */}
            {annotationCount > 0 && <div className="shiteki-toolbar-sep" />}

            {/* Copy */}
            {annotationCount > 0 && (
              <button className="shiteki-toolbar-btn" onClick={onCopy} title="Copy to clipboard">
                {copied ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </button>
            )}

            {/* Send */}
            {annotationCount > 0 && (
              <button
                className="shiteki-toolbar-btn"
                onClick={onSend}
                disabled={sending}
                title="Send as GitHub Issue"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            )}

            {/* Clear */}
            {annotationCount > 0 && (
              <button className="shiteki-toolbar-btn" onClick={onClear} title="Clear all annotations">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            )}

            {/* Settings */}
            <button
              className={`shiteki-toolbar-btn ${settingsOpen ? "shiteki-toolbar-btn--active" : ""}`}
              onClick={onSettings}
              title="Settings"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>

            {/* Separator before close */}
            <div className="shiteki-toolbar-sep" />

            {/* Close */}
            <button className="shiteki-toolbar-btn" onClick={onClose} title="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shortcut hint — shown once on first activation */}
      <AnimatePresence>
        {open && showHint && (
          <motion.div
            key="hint"
            className="shiteki-shortcut-hint"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
          >
            <span>
              <kbd>X</kbd> Toggle
              <kbd>C</kbd> Copy
              <kbd>S</kbd> Send
              <kbd>DD</kbd> Clear
            </span>
            <button className="shiteki-shortcut-hint-close" onClick={onDismissHint} aria-label="Dismiss">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
