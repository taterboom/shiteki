import { handleOptions, withCors } from "./cors";
import { createGitHubIssue } from "./github";
import { Env, ErrorResponseBody, SendResponseBody } from "./types";
import { validateSendRequest } from "./validation";

function jsonResponse(body: SendResponseBody | ErrorResponseBody, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return handleOptions();
    }

    const url = new URL(request.url);

    if (url.pathname === "/actions/send" && request.method === "POST") {
      try {
        const body = await request.json();

        if (!validateSendRequest(body)) {
          return withCors(
            jsonResponse({ success: false, error: "Missing required fields: owner, repo, data.title" }, 400)
          );
        }

        const issue = await createGitHubIssue(env.GITHUB_TOKEN, body);

        return withCors(
          jsonResponse({ success: true, issueUrl: issue.html_url, issueNumber: issue.number }, 201)
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "Internal server error";
        return withCors(jsonResponse({ success: false, error: message }, 500));
      }
    }

    return withCors(jsonResponse({ success: false, error: "Not found" }, 404));
  },
} satisfies ExportedHandler<Env>;
