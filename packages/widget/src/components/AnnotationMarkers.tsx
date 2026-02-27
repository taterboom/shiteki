import React from "react";
import { AnimatePresence } from "motion/react";
import { Annotation } from "../types";
import { useMarkerPositions } from "../hooks/useMarkerPositions";
import { AnnotationMarker } from "./AnnotationMarker";

interface AnnotationMarkersProps {
  annotations: Annotation[];
  onClick: (id: number, e: React.MouseEvent) => void;
}

export function AnnotationMarkers({ annotations, onClick }: AnnotationMarkersProps) {
  const positions = useMarkerPositions(annotations);

  return (
    <AnimatePresence>
      {positions.map((pos) => (
        <AnnotationMarker
          key={pos.id}
          id={pos.id}
          index={pos.index}
          top={pos.top}
          left={pos.left}
          onClick={onClick}
        />
      ))}
    </AnimatePresence>
  );
}
