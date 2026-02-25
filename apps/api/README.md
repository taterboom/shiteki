# Shiji API

Cloudflare Worker that creates GitHub Issues from the Shiji widget.

## Setup

### 1. Create a GitHub Personal Access Token

1. Go to [github.com/settings/tokens?type=beta](https://github.com/settings/tokens?type=beta) (Fine-grained tokens)
2. Click **"Generate new token"**
3. Configure:
   - **Token name**: `shiji-api` (or any name)
   - **Expiration**: choose as needed
   - **Repository access**: select **"Only select repositories"**, then pick the repo(s) you want Shiji to create issues in
   - **Permissions** → **Repository permissions** → **Issues**: set to **Read and write**
4. Click **"Generate token"** and copy the token (starts with `github_pat_...`)

### 2. Set the secret in Cloudflare Workers

```bash
cd apps/api
npx wrangler secret put GITHUB_TOKEN
```

Paste your token when prompted. This stores it securely as an encrypted secret — it will **not** appear in `wrangler.toml` or any config file.

### 3. Local development

For local development with `wrangler dev`, create a `.dev.vars` file:

```bash
# apps/api/.dev.vars
GITHUB_TOKEN=github_pat_xxxxx
```

> `.dev.vars` is gitignored and never deployed. It's only used by `wrangler dev` locally.

## Commands

```bash
pnpm dev      # Start local dev server
pnpm deploy   # Deploy to Cloudflare Workers
```

## API

### `POST /actions/send`

Creates a GitHub Issue.

**Request body:**

```json
{
  "owner": "taterboom",
  "repo": "shiji",
  "data": {
    "title": "Bug: button misaligned",
    "body": "The submit button overflows on mobile.",
    "labels": ["bug"]
  }
}
```

**Response (201):**

```json
{
  "success": true,
  "issueUrl": "https://github.com/taterboom/shiji/issues/1",
  "issueNumber": 1
}
```
