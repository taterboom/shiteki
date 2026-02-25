import React, { useCallback, useState } from "react";
import { motion } from "motion/react";
import { spring } from "../utils/spring";
import { ShijiConfig } from "../types";

interface SettingsPanelProps {
  config: ShijiConfig;
  onSave: (partial: Partial<ShijiConfig>) => void;
  onCancel: () => void;
}

export function SettingsPanel({ config, onSave, onCancel }: SettingsPanelProps) {
  const [endpoint, setEndpoint] = useState(config.endpoint);
  const [owner, setOwner] = useState(config.owner);
  const [repo, setRepo] = useState(config.repo);
  const [labels, setLabels] = useState((config.labels ?? []).join(", "));

  const handleSave = useCallback(() => {
    onSave({
      endpoint: endpoint.trim(),
      owner: owner.trim(),
      repo: repo.trim(),
      labels: labels
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean),
    });
  }, [endpoint, owner, repo, labels, onSave]);

  return (
    <motion.div
      className="shiji-settings"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={spring}
    >
      <div className="shiji-settings-header">Settings</div>
      <div className="shiji-settings-body">
        <label className="shiji-settings-field">
          <span className="shiji-settings-label">Endpoint</span>
          <input
            className="shiji-settings-input"
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="https://..."
          />
        </label>
        <label className="shiji-settings-field">
          <span className="shiji-settings-label">Owner</span>
          <input
            className="shiji-settings-input"
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="github-username"
          />
        </label>
        <label className="shiji-settings-field">
          <span className="shiji-settings-label">Repo</span>
          <input
            className="shiji-settings-input"
            type="text"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="repository-name"
          />
        </label>
        <label className="shiji-settings-field">
          <span className="shiji-settings-label">Labels</span>
          <input
            className="shiji-settings-input"
            type="text"
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
            placeholder="bug, feedback"
          />
        </label>
      </div>
      <div className="shiji-settings-actions">
        <button className="shiji-btn shiji-btn--ghost" onClick={onCancel}>
          Cancel
        </button>
        <button className="shiji-btn shiji-btn--primary" onClick={handleSave}>
          Save
        </button>
      </div>
    </motion.div>
  );
}
