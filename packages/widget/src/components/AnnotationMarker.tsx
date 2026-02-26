import React from "react";
import { motion } from "motion/react";
import { spring } from "../utils/spring";

interface AnnotationMarkerProps {
  id: number;
  top: number;
  left: number;
  onRemove: (id: number) => void;
}

export function AnnotationMarker({ id, top, left, onRemove }: AnnotationMarkerProps) {
  return (
    <motion.div
      className="shiteki-marker"
      style={{ top: top - 10, left: left - 10 }}
      title={`Annotation #${id} (click to remove)`}
      onClick={() => onRemove(id)}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={spring}
      whileHover={{ scale: 1.25 }}
    >
      {id}
    </motion.div>
  );
}
