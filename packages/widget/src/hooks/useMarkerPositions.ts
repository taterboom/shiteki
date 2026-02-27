import { useEffect, useState } from "react";
import { Annotation } from "../types";

interface MarkerPosition {
  id: number;
  index: number;
  top: number;
  left: number;
}

export function useMarkerPositions(annotations: Annotation[]): MarkerPosition[] {
  const [positions, setPositions] = useState<MarkerPosition[]>([]);

  useEffect(() => {
    function update() {
      const newPositions = annotations.map((ann, i) => {
        const index = i + 1;
        const el = document.querySelector(ann.elementInfo.selector);
        if (el) {
          const rect = el.getBoundingClientRect();
          return { id: ann.id, index, top: rect.top, left: rect.left + rect.width };
        }
        // Fallback to stored rect
        const r = ann.elementInfo.rect;
        return { id: ann.id, index, top: r.top, left: r.left + r.width };
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
