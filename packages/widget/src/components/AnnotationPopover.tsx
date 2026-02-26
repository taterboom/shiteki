import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { spring } from "../utils/spring";
import { ElementInfo } from "../types";

interface AnnotationPopoverProps {
  elementInfo: ElementInfo;
  onAdd: (comment: string) => void;
  onCancel: () => void;
}

export function AnnotationPopover({ elementInfo, onAdd, onCancel }: AnnotationPopoverProps) {
  const [comment, setComment] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Position calculation: below element if space, above otherwise
  const { rect } = elementInfo;
  const spaceBelow = window.innerHeight - (rect.top + rect.height);
  const above = spaceBelow < 250;

  const top = above
    ? rect.top - 180 // will be transformed up by popover height
    : rect.top + rect.height + 8;

  let left = rect.left + rect.width / 2 - 160; // center 320px popover
  left = Math.max(12, Math.min(left, window.innerWidth - 332));

  const yOffset = above ? -8 : 8;

  const handlePointerDown = (e: React.PointerEvent) => {
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: dragOffset.x, origY: dragOffset.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    setDragOffset({
      x: dragRef.current.origX + e.clientX - dragRef.current.startX,
      y: dragRef.current.origY + e.clientY - dragRef.current.startY,
    });
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onAdd(comment.trim());
  };

  return (
    <motion.div
      className="shiteki-popover"
      style={{ top: top + dragOffset.y, left: left + dragOffset.x, transformOrigin: above ? "bottom center" : "top center" }}
      initial={{ opacity: 0, scale: 0.95, y: yOffset }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: yOffset }}
      transition={spring}
    >
      <div
        className="shiteki-popover-info"
        style={{ cursor: "grab" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <span className="shiteki-popover-tag">&lt;{elementInfo.tagName}&gt;</span>
        {elementInfo.textContent && (
          <span className="shiteki-popover-text">"{elementInfo.textContent}"</span>
        )}
      </div>

      <form className="shiteki-popover-form" onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          className="shiteki-popover-textarea"
          placeholder="What should change?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
        />
        <div className="shiteki-popover-actions">
          <button type="button" className="shiteki-btn shiteki-btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="shiteki-btn shiteki-btn--primary" disabled={!comment.trim()}>
            Add
          </button>
        </div>
      </form>
    </motion.div>
  );
}
