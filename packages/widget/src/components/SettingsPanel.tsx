import React, { useCallback, useState } from "react";
import { motion } from "motion/react";
import { spring } from "../utils/spring";
import { ShitekiConfig } from "../types";

function HelpLink({ href }: { href: string }) {
  return (
    <a
      className="shiteki-settings-help"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        <text
          x="8"
          y="11.5"
          textAnchor="middle"
          fill="currentColor"
          fontSize="10"
          fontWeight="600"
          fontFamily="inherit"
        >
          ?
        </text>
      </svg>
    </a>
  );
}

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
  const [clearAfterCopy, setClearAfterCopy] = useState(config.clearAfterCopy ?? false);

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
      clearAfterCopy,
    });
  }, [mode, endpoint, githubToken, owner, repo, labels, clearAfterCopy, onSave]);

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
            <span className="shiteki-settings-label">
              Endpoint
              <HelpLink href="https://github.com/taterboom/shiteki/tree/main/apps/api" />
            </span>
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
            <span className="shiteki-settings-label">
              GitHub Token
              <HelpLink href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens" />
            </span>
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
          <span className="shiteki-settings-label">
            Labels
            <HelpLink href="https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/managing-labels" />
          </span>
          <input
            className="shiteki-settings-input"
            type="text"
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
            placeholder="bug, feedback"
          />
        </label>

        <label className="shiteki-settings-field shiteki-settings-field--row">
          <span className="shiteki-settings-label">Clear after copy</span>
          <input
            type="checkbox"
            className="shiteki-settings-checkbox"
            checked={clearAfterCopy}
            onChange={(e) => setClearAfterCopy(e.target.checked)}
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
