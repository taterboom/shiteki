import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { spring } from "../utils/spring";

interface SendDialogProps {
  defaultTitle: string;
  sending: boolean;
  onConfirm: (title: string) => void;
  onCancel: () => void;
}

export function SendDialog({ defaultTitle, sending, onConfirm, onCancel }: SendDialogProps) {
  const [title, setTitle] = useState(defaultTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim() || sending) return;
      onConfirm(title.trim());
    },
    [title, sending, onConfirm]
  );

  return (
    <motion.div
      className="shiji-popover"
      style={{
        position: "fixed",
        bottom: 76,
        right: 20,
        width: 320,
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={spring}
    >
      <div className="shiji-popover-info">
        <span className="shiji-popover-tag">Create Issue</span>
      </div>
      <form className="shiji-popover-form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className="shiji-settings-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Issue title"
        />
        <div className="shiji-popover-actions">
          <button
            type="button"
            className="shiji-btn shiji-btn--ghost"
            onClick={onCancel}
            disabled={sending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="shiji-btn shiji-btn--primary"
            disabled={!title.trim() || sending}
          >
            {sending ? "Sending…" : "Send"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
