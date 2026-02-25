import { useCallback, useState } from "react";
import { ShijiConfig, SubmitState } from "../types";

export function useSubmit(config: ShijiConfig) {
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  const submit = useCallback(
    async (title: string, body: string) => {
      setState({ status: "loading" });
      try {
        const res = await fetch(`${config.endpoint}/actions/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            owner: config.owner,
            repo: config.repo,
            data: {
              title,
              body,
              labels: config.labels,
            },
          }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error ?? "Failed to submit");
        }
        setState({
          status: "success",
          result: { issueUrl: json.issueUrl, issueNumber: json.issueNumber },
        });
      } catch (err) {
        setState({
          status: "error",
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    },
    [config.endpoint, config.owner, config.repo, config.labels]
  );

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { state, submit, reset };
}
