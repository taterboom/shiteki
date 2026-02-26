import React, { useCallback, useState } from "react";
import { motion } from "motion/react";
import { spring } from "../utils/spring";
import { ShitekiConfig } from "../types";

interface SettingsPanelProps {
  config: ShitekiConfig;
  onSave: (partial: Partial<ShitekiConfig>) => void;
  onCancel: () => void;
}

export function SettingsPanel({ config, onSave, onCancel }: SettingsPanelProps) {
  const [mode, setMode] = useState(config.mode);
  const [endpoint, setEndpoint] = useState(config.endpoint);
  const [githubToken, setGithubToken] = useState(config.githubToken);
  const [owner, setOwner] = useState(config.owner);
  const [repo, setRepo] = useState(config.repo);
  const [labels, setLabels] = useState((config.labels ?? []).join(", "));

  const handleSave = useCallback(() => {
    onSave({
      mode,
      endpoint: endpoint.trim(),
      githubToken: githubToken.trim(),
      owner: owner.trim(),
      repo: repo.trim(),
      labels: labels
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean),
    });
  }, [mode, endpoint, githubToken, owner, repo, labels, onSave]);

  return (
    <motion.div
      className="shiteki-settings"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={spring}
    >
      <div className="shiteki-settings-header">Settings</div>
      <div className="shiteki-settings-body">
        <div className="shiteki-settings-field">
          <span className="shiteki-settings-label">Submit mode</span>
          <div className="shiteki-radio-group">
            <label className="shiteki-radio">
              <input
                type="radio"
                name="shiteki-mode"
                checked={mode === "endpoint"}
                onChange={() => setMode("endpoint")}
              />
              <span>Endpoint</span>
            </label>
            <label className="shiteki-radio">
              <input
                type="radio"
                name="shiteki-mode"
                checked={mode === "direct"}
                onChange={() => setMode("direct")}
              />
              <span>Direct</span>
            </label>
          </div>
        </div>

        {mode === "endpoint" ? (
          <label className="shiteki-settings-field">
            <span className="shiteki-settings-label">Endpoint</span>
            <input
              className="shiteki-settings-input"
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="https://..."
            />
          </label>
        ) : (
          <label className="shiteki-settings-field">
            <span className="shiteki-settings-label">GitHub Token</span>
            <input
              className="shiteki-settings-input"
              type="password"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              placeholder="github_pat_..."
            />
          </label>
        )}

        <label className="shiteki-settings-field">
          <span className="shiteki-settings-label">Owner</span>
          <input
            className="shiteki-settings-input"
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="github-username"
          />
        </label>
        <label className="shiteki-settings-field">
          <span className="shiteki-settings-label">Repo</span>
          <input
            className="shiteki-settings-input"
            type="text"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="repository-name"
          />
        </label>
        <label className="shiteki-settings-field">
          <span className="shiteki-settings-label">Labels</span>
          <input
            className="shiteki-settings-input"
            type="text"
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
            placeholder="bug, feedback"
          />
        </label>
      </div>
      <div className="shiteki-settings-actions">
        <button className="shiteki-btn shiteki-btn--ghost" onClick={onCancel}>
          Cancel
        </button>
        <button className="shiteki-btn shiteki-btn--primary" onClick={handleSave}>
          Save
        </button>
      </div>
    </motion.div>
  );
}
