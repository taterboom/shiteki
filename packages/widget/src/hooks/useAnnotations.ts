import { useCallback, useRef, useState } from "react";
import { Annotation, ElementInfo } from "../types";

const STORAGE_KEY = "shiteki:annotations";

interface StoredAnnotations {
  annotations: Annotation[];
  nextId: number;
}

function readStored(): StoredAnnotations | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStored(annotations: Annotation[], nextId: number) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ annotations, nextId }));
  } catch {
    // storage full — silently ignore
  }
}

function removeStored() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function useAnnotations() {
  const stored = readStored();
  const [annotations, setAnnotations] = useState<Annotation[]>(stored?.annotations ?? []);
  const nextIdRef = useRef(stored?.nextId ?? 1);

  const add = useCallback((elementInfo: ElementInfo, comment: string) => {
    const annotation: Annotation = {
      id: nextIdRef.current++,
      elementInfo,
      comment,
      createdAt: Date.now(),
    };
    setAnnotations((prev) => {
      const next = [...prev, annotation];
      writeStored(next, nextIdRef.current);
      return next;
    });
    return annotation;
  }, []);

  const update = useCallback((id: number, comment: string) => {
    setAnnotations((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, comment } : a));
      writeStored(next, nextIdRef.current);
      return next;
    });
  }, []);

  const remove = useCallback((id: number) => {
    setAnnotations((prev) => {
      const next = prev.filter((a) => a.id !== id);
      writeStored(next, nextIdRef.current);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setAnnotations([]);
    nextIdRef.current = 1;
    removeStored();
  }, []);

  return { annotations, add, update, remove, clear };
}
