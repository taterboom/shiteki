import React from "react";

interface ElementHighlightProps {
  rect: { top: number; left: number; width: number; height: number } | null;
}

export function ElementHighlight({ rect }: ElementHighlightProps) {
  if (!rect) return null;

  return (
    <div
      className="shiji-highlight"
      style={{
        top: rect.top - 1,
        left: rect.left - 1,
        width: rect.width + 2,
        height: rect.height + 2,
      }}
    />
  );
}
