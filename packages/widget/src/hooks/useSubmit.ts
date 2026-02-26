import { useCallback, useState } from "react";
import { ShitekiConfig, SubmitState } from "../types";

const SHITEKI_FOOTER = "\n\n---\n*Submitted via [Shiteki](https://github.com/taterboom/shiteki)*";

async function submitViaEndpoint(config: ShitekiConfig, title: string, body: string) {
  const res = await fetch(`${config.endpoint}/actions/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      owner: config.owner,
      repo: config.repo,
      data: { title, body, labels: config.labels },
    }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error ?? "Failed to submit");
  }
  return { issueUrl: json.issueUrl as string, issueNumber: json.issueNumber as number };
}

async function submitDirect(config: ShitekiConfig, title: string, body: string) {
  const issueBody = body + SHITEKI_FOOTER;
  const res = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/issues`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.githubToken}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "shiteki-widget",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        body: issueBody,
        labels: config.labels,
      }),
    }
  );
  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.message ?? `GitHub API error (${res.status})`);
  }
  const json = await res.json();
  return { issueUrl: json.html_url as string, issueNumber: json.number as number };
}

export function useSubmit(config: ShitekiConfig) {
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  const submit = useCallback(
    async (title: string, body: string) => {
      setState({ status: "loading" });
      try {
        const result =
          config.mode === "direct"
            ? await submitDirect(config, title, body)
            : await submitViaEndpoint(config, title, body);
        setState({ status: "success", result });
      } catch (err) {
        setState({
          status: "error",
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    },
    [config.mode, config.endpoint, config.githubToken, config.owner, config.repo, config.labels]
  );

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { state, submit, reset };
}
