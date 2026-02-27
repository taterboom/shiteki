import React, { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { AnimatePresence } from "motion/react";
import { Annotation, ElementInfo, ShitekiConfig, WidgetMode } from "../types";
import { useAnnotations } from "../hooks/useAnnotations";
import { useConfig } from "../hooks/useConfig";
import { useElementPicker } from "../hooks/useElementPicker";
import { useSubmit } from "../hooks/useSubmit";
import { useClipboard } from "../hooks/useClipboard";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { useShortcutHint } from "../hooks/useShortcutHint";
import { generatePrompt } from "../utils/generatePrompt";
import { Toolbar } from "./Toolbar";
import { ElementHighlight } from "./ElementHighlight";
import { AnnotationPopover } from "./AnnotationPopover";
import { AnnotationDetailPopover } from "./AnnotationDetailPopover";
import { AnnotationMarkers } from "./AnnotationMarkers";
import { StatusMessage } from "./StatusMessage";
import { SettingsPanel } from "./SettingsPanel";
import { SendDialog } from "./SendDialog";

import "../styles/widget.css";

export function ShitekiWidget(props: ShitekiConfig) {
  const { config, updateConfig } = useConfig(props);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<WidgetMode>("idle");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState<ElementInfo | null>(null);
  const [viewingAnnotation, setViewingAnnotation] = useState<Annotation | null>(null);
  const { annotations, add, update, remove, clear } = useAnnotations();
  const { state: submitState, submit, reset: resetSubmit } = useSubmit(config);
  const { copied, copy } = useClipboard();
  const { showHint, dismissHint } = useShortcutHint();

  // Clear annotations from localStorage on successful send
  useEffect(() => {
    if (submitState.status === "success") {
      clear();
    }
  }, [submitState.status, clear]);

  const handleElementSelected = useCallback((info: ElementInfo) => {
    setSelectedElement(info);
    setMode("annotating");
  }, []);

  const { hoveredRect } = useElementPicker({
    enabled: open && mode === "picking",
    onElementSelected: handleElementSelected,
  });

  const handleOpen = useCallback(() => {
    setOpen(true);
    setMode("picking");
  }, []);

  const handleToggleOpen = useCallback(() => {
    setOpen((prev) => {
      if (prev) {
        setMode("idle");
        setSelectedElement(null);
        setSettingsOpen(false);
      } else {
        setMode("picking");
      }
      return !prev;
    });
  }, []);

  const handleAddAnnotation = useCallback(
    (comment: string) => {
      if (selectedElement) {
        add(selectedElement, comment);
      }
      setSelectedElement(null);
      setMode("picking");
    },
    [selectedElement, add]
  );

  const handleCancelAnnotation = useCallback(() => {
    setSelectedElement(null);
    setMode("picking");
  }, []);

  const handleMarkerClick = useCallback(
    (id: number, e: React.MouseEvent) => {
      if (e.metaKey || e.ctrlKey) {
        remove(id);
      } else {
        const ann = annotations.find((a) => a.id === id);
        if (ann) setViewingAnnotation(ann);
      }
    },
    [annotations, remove]
  );

  const handleCloseViewing = useCallback(() => {
    setViewingAnnotation(null);
  }, []);

  const handleUpdateViewing = useCallback(
    (comment: string) => {
      if (viewingAnnotation) {
        update(viewingAnnotation.id, comment);
        setViewingAnnotation(null);
      }
    },
    [viewingAnnotation, update]
  );

  const handleRemoveViewing = useCallback(() => {
    if (viewingAnnotation) {
      remove(viewingAnnotation.id);
      setViewingAnnotation(null);
    }
  }, [viewingAnnotation, remove]);

  const handleCopy = useCallback(() => {
    const prompt = generatePrompt(annotations);
    copy(prompt);
    if (config.clearAfterCopy) {
      clear();
      setSelectedElement(null);
    }
  }, [annotations, copy, config.clearAfterCopy, clear]);

  const handleSend = useCallback(() => {
    setSendDialogOpen(true);
  }, []);

  const handleSendConfirm = useCallback(
    (title: string) => {
      const prompt = generatePrompt(annotations);
      submit(title, prompt);
      setSendDialogOpen(false);
    },
    [annotations, submit]
  );

  const handleSendCancel = useCallback(() => {
    setSendDialogOpen(false);
  }, []);

  const handleClear = useCallback(() => {
    clear();
    setSelectedElement(null);
    setViewingAnnotation(null);
  }, [clear]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setMode("idle");
    setSelectedElement(null);
    setViewingAnnotation(null);
    setSettingsOpen(false);
  }, []);

  const handleToggleSettings = useCallback(() => {
    setSettingsOpen((prev) => !prev);
  }, []);

  const handleSettingsSave = useCallback(
    (partial: Partial<ShitekiConfig>) => {
      updateConfig(partial);
      setSettingsOpen(false);
    },
    [updateConfig]
  );

  const handleSettingsCancel = useCallback(() => {
    setSettingsOpen(false);
  }, []);
  
  const canSend =
    config.owner.trim() !== "" &&
    config.repo.trim() !== "" &&
    (config.mode === "endpoint"
      ? config.endpoint.trim() !== ""
      : config.githubToken.trim() !== "");
  
  useKeyboardShortcuts({
    open,
    mode,
    annotationCount: annotations.length,
    canSend,
    settingsOpen,
    sendDialogOpen,
    onCopy: handleCopy,
    onSend: handleSend,
    onClear: handleClear,
    onToggleOpen: handleToggleOpen,
    onClose: handleClose,
    onCancelAnnotation: handleCancelAnnotation,
    onCloseSettings: handleSettingsCancel,
    onCloseSendDialog: handleSendCancel,
  });

  return ReactDOM.createPortal(
    <div className="shiteki-root">
      <Toolbar
        open={open}
        annotationCount={annotations.length}
        copied={copied}
        sending={submitState.status === "loading"}
        canSend={canSend}
        settingsOpen={settingsOpen}
        onOpen={handleOpen}
        onCopy={handleCopy}
        onSend={handleSend}
        onClear={handleClear}
        onSettings={handleToggleSettings}
        onClose={handleClose}
        showHint={showHint}
        onDismissHint={dismissHint}
      />

      {open && (
        <>
          <ElementHighlight rect={hoveredRect} />

          <AnimatePresence>
            {mode === "annotating" && selectedElement && (
              <AnnotationPopover
                key="popover"
                elementInfo={selectedElement}
                onAdd={handleAddAnnotation}
                onCancel={handleCancelAnnotation}
              />
            )}
          </AnimatePresence>

          <AnnotationMarkers annotations={annotations} onClick={handleMarkerClick} />

          <AnimatePresence>
            {viewingAnnotation && (
              <AnnotationDetailPopover
                key="detail"
                annotation={viewingAnnotation}
                index={annotations.findIndex((a) => a.id === viewingAnnotation.id) + 1}
                onUpdate={handleUpdateViewing}
                onRemove={handleRemoveViewing}
                onClose={handleCloseViewing}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {settingsOpen && (
              <SettingsPanel
                key="settings"
                config={config}
                onSave={handleSettingsSave}
                onCancel={handleSettingsCancel}
              />
            )}
            {sendDialogOpen && (
              <SendDialog
                key="send-dialog"
                defaultTitle={`Visual Annotations (${annotations.length}) — ${document.title || location.href}`}
                sending={submitState.status === "loading"}
                onConfirm={handleSendConfirm}
                onCancel={handleSendCancel}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {submitState.status !== "idle" && (
              <StatusMessage key="status" state={submitState} onDismiss={resetSubmit} />
            )}
          </AnimatePresence>
        </>
      )}
    </div>,
    document.body
  );
}
