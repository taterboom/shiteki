import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { spring } from "../utils/spring";
import { Annotation } from "../types";

interface AnnotationDetailPopoverProps {
  annotation: Annotation;
  index: number;
  onUpdate: (comment: string) => void;
  onRemove: () => void;
  onClose: () => void;
}

export function AnnotationDetailPopover({ annotation, index, onUpdate, onRemove, onClose }: AnnotationDetailPopoverProps) {
  const [comment, setComment] = useState(annotation.comment);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const { rect } = annotation.elementInfo;
  const spaceBelow = window.innerHeight - (rect.top + rect.height);
  const above = spaceBelow < 250;

  const top = above
    ? rect.top - 180
    : rect.top + rect.height + 8;

  let left = rect.left + rect.width / 2 - 160;
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
    onUpdate(comment.trim());
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
        <span className="shiteki-popover-tag">#{index} &lt;{annotation.elementInfo.tagName}&gt;</span>
        {annotation.elementInfo.textContent && (
          <span className="shiteki-popover-text">"{annotation.elementInfo.textContent}"</span>
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
          <button type="button" className="shiteki-btn shiteki-btn--danger shiteki-btn--icon" onClick={onRemove} title="Remove annotation">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
          <div style={{ flex: 1 }} />
          <button type="button" className="shiteki-btn shiteki-btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="shiteki-btn shiteki-btn--primary" disabled={!comment.trim()}>
            Save
          </button>
        </div>
      </form>
    </motion.div>
  );
}
