import { useEffect, useState } from "react";
import { Annotation } from "../types";

interface MarkerPosition {
  id: number;
  top: number;
  left: number;
}

export function useMarkerPositions(annotations: Annotation[]): MarkerPosition[] {
  const [positions, setPositions] = useState<MarkerPosition[]>([]);

  useEffect(() => {
    function update() {
      const newPositions = annotations.map((ann) => {
        const el = document.querySelector(ann.elementInfo.selector);
        if (el) {
          const rect = el.getBoundingClientRect();
          return { id: ann.id, top: rect.top, left: rect.left + rect.width };
        }
        // Fallback to stored rect
        const r = ann.elementInfo.rect;
        return { id: ann.id, top: r.top, left: r.left + r.width };
      });
      setPositions(newPositions);
    }

    update();

    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [annotations]);

  return positions;
}
