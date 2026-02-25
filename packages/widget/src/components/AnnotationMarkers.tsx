import React from "react";
import { AnimatePresence } from "motion/react";
import { Annotation } from "../types";
import { useMarkerPositions } from "../hooks/useMarkerPositions";
import { AnnotationMarker } from "./AnnotationMarker";

interface AnnotationMarkersProps {
  annotations: Annotation[];
  onRemove: (id: number) => void;
}

export function AnnotationMarkers({ annotations, onRemove }: AnnotationMarkersProps) {
  const positions = useMarkerPositions(annotations);

  return (
    <AnimatePresence>
      {positions.map((pos) => (
        <AnnotationMarker
          key={pos.id}
          id={pos.id}
          top={pos.top}
          left={pos.left}
          onRemove={onRemove}
        />
      ))}
    </AnimatePresence>
  );
}
