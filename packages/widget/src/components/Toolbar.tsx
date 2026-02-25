import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { spring } from "../utils/spring";
import { WidgetMode } from "../types";

interface ToolbarProps {
  open: boolean;
  mode: WidgetMode;
  annotationCount: number;
  copied: boolean;
  sending: boolean;
  settingsOpen: boolean;
  onOpen: () => void;
  onTogglePicker: () => void;
  onCopy: () => void;
  onSend: () => void;
  onClear: () => void;
  onSettings: () => void;
  onClose: () => void;
}

export function Toolbar({
  open,
  mode,
  annotationCount,
  copied,
  sending,
  settingsOpen,
  onOpen,
  onTogglePicker,
  onCopy,
  onSend,
  onClear,
  onSettings,
  onClose,
}: ToolbarProps) {
  const picking = mode === "picking" || mode === "annotating";

  return (
    <motion.div
      layout
      className="shiji-toolbar"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        gap: open ? 4 : 0,
        padding: open ? "6px 8px" : "6px",
        background: open
          ? "rgba(255, 255, 255, 0.55)"
          : "rgb(37, 99, 235)",
        borderColor: open
          ? "rgba(255, 255, 255, 0.3)"
          : "transparent",
        boxShadow: open
          ? "0 8px 32px rgba(0, 0, 0, 0.08)"
          : "0 2px 16px rgba(37, 99, 235, 0.3)",
      }}
      transition={spring}
      onClick={!open ? onOpen : undefined}
      role={!open ? "button" : undefined}
      aria-label={!open ? "Open Shiji" : undefined}
      style={{ cursor: !open ? "pointer" : undefined }}
      whileHover={!open ? { scale: 1.08, boxShadow: "0 4px 20px rgba(37, 99, 235, 0.4)" } : undefined}
      whileTap={!open ? { scale: 0.95 } : undefined}
    >
      {/* Crosshair / pick toggle with badge */}
      <div className="shiji-toolbar-picker">
        <motion.button
          className={`shiji-toolbar-btn ${picking && open ? "shiji-toolbar-btn--active" : ""}`}
          onClick={open ? onTogglePicker : undefined}
          tabIndex={open ? 0 : -1}
          title={picking ? "Stop picking" : "Pick element"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={!open ? { color: "#fff", pointerEvents: "none" } : undefined}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="2" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
          </svg>
        </motion.button>
        {open && annotationCount > 0 && (
          <motion.span
            className="shiji-toolbar-badge"
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
            layout
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={spring}
            style={{ overflow: "hidden", display: "flex", alignItems: "center", gap: 4 }}
          >
            {/* Separator */}
            {annotationCount > 0 && <div className="shiji-toolbar-sep" />}

            {/* Copy */}
            {annotationCount > 0 && (
              <button className="shiji-toolbar-btn" onClick={onCopy} title="Copy to clipboard">
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
                className="shiji-toolbar-btn"
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
              <button className="shiji-toolbar-btn" onClick={onClear} title="Clear all annotations">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            )}

            {/* Settings */}
            <button
              className={`shiji-toolbar-btn ${settingsOpen ? "shiji-toolbar-btn--active" : ""}`}
              onClick={onSettings}
              title="Settings"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>

            {/* Separator before close */}
            <div className="shiji-toolbar-sep" />

            {/* Close */}
            <button className="shiji-toolbar-btn" onClick={onClose} title="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
