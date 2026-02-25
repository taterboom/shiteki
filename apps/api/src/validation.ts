import { SendRequestBody } from "./types";

export function validateSendRequest(
  body: unknown
): body is SendRequestBody {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  if (typeof b.owner !== "string" || !b.owner) return false;
  if (typeof b.repo !== "string" || !b.repo) return false;
  if (typeof b.data !== "object" || b.data === null) return false;
  const data = b.data as Record<string, unknown>;
  if (typeof data.title !== "string" || !data.title) return false;
  return true;
}
