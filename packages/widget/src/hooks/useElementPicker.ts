import { useCallback, useEffect, useRef, useState } from "react";
import { ElementInfo } from "../types";
import { getElementInfo } from "../utils/getElementInfo";
import { isShitekiElement } from "../utils/isShitekiElement";

interface UseElementPickerOptions {
  enabled: boolean;
  onElementSelected: (info: ElementInfo) => void;
}

export function useElementPicker({ enabled, onElementSelected }: UseElementPickerOptions) {
  const [hoveredRect, setHoveredRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const onElementSelectedRef = useRef(onElementSelected);
  onElementSelectedRef.current = onElementSelected;

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el || isShitekiElement(el)) {
      setHoveredRect(null);
      return;
    }
    const rect = el.getBoundingClientRect();
    setHoveredRect({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });
  }, []);

  const handleClick = useCallback((e: MouseEvent) => {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el || isShitekiElement(el)) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const info = getElementInfo(el);
    setHoveredRect(null);
    onElementSelectedRef.current(info);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setHoveredRect(null);
      return;
    }

    document.body.style.cursor = "crosshair";
    document.addEventListener("mousemove", handleMouseMove, true);
    document.addEventListener("click", handleClick, true);

    return () => {
      document.body.style.cursor = "";
      document.removeEventListener("mousemove", handleMouseMove, true);
      document.removeEventListener("click", handleClick, true);
    };
  }, [enabled, handleMouseMove, handleClick]);

  return { hoveredRect };
}
