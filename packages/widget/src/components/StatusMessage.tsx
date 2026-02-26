import React, { useEffect } from "react";
import { motion } from "motion/react";
import { spring } from "../utils/spring";
import { SubmitState } from "../types";

interface StatusMessageProps {
  state: SubmitState;
  onDismiss: () => void;
}

export function StatusMessage({ state, onDismiss }: StatusMessageProps) {
  useEffect(() => {
    if (state.status === "success" || state.status === "error") {
      const timer = setTimeout(onDismiss, 4000);
      return () => clearTimeout(timer);
    }
  }, [state.status, onDismiss]);

  if (state.status === "success") {
    return (
      <motion.div
        className="shiteki-status shiteki-status--success"
        initial={{ opacity: 0, y: 12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.95 }}
        transition={spring}
      >
        Issue created!{" "}
        <a href={state.result.issueUrl} target="_blank" rel="noopener noreferrer">
          #{state.result.issueNumber}
        </a>
      </motion.div>
    );
  }

  if (state.status === "error") {
    return (
      <motion.div
        className="shiteki-status shiteki-status--error"
        initial={{ opacity: 0, y: 12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.95 }}
        transition={spring}
      >
        {state.error}
      </motion.div>
    );
  }

  if (state.status === "loading") {
    return (
      <motion.div
        className="shiteki-status"
        initial={{ opacity: 0, y: 12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.95 }}
        transition={spring}
      >
        Sending...
      </motion.div>
    );
  }

  return null;
}
