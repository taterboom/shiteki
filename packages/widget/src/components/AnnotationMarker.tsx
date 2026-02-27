import React from "react";
import { motion } from "motion/react";
import { spring } from "../utils/spring";

interface AnnotationMarkerProps {
  id: number;
  index: number;
  top: number;
  left: number;
  onClick: (id: number, e: React.MouseEvent) => void;
}

export function AnnotationMarker({ id, index, top, left, onClick }: AnnotationMarkerProps) {
  return (
    <motion.div
      className="shiteki-marker"
      style={{ top: top - 10, left: left - 10 }}
      title={`#${index} — click to view, ${navigator.userAgent.includes("Mac") ? "⌘" : "Ctrl"}+click to remove`}
      onClick={(e) => onClick(id, e)}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={spring}
      whileHover={{ scale: 1.25 }}
    >
      {index}
    </motion.div>
  );
}
