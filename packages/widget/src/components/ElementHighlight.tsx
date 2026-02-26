import React from "react";

interface ElementHighlightProps {
  rect: { top: number; left: number; width: number; height: number } | null;
}

export function ElementHighlight({ rect }: ElementHighlightProps) {
  if (!rect) return null;

  return (
    <div
      className="shiteki-highlight"
      style={{
        top: rect.top - 1.5,
        left: rect.left - 1.5,
        width: rect.width + 3,
        height: rect.height + 3,
      }}
    />
  );
}
