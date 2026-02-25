import { SendRequestBody } from "./types";

interface GitHubIssueResponse {
  html_url: string;
  number: number;
}

export async function createGitHubIssue(
  token: string,
  body: SendRequestBody
): Promise<GitHubIssueResponse> {
  const { owner, repo, data } = body;

  let issueBody = data.body ?? "";
  issueBody += "\n\n---\n*Submitted via [Shiji](https://github.com/taterboom/shiji)*";

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "shiji-api",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        body: issueBody,
        labels: data.labels,
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error (${res.status}): ${text}`);
  }

  return res.json() as Promise<GitHubIssueResponse>;
}
