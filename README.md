# Shiji (指示)

Lightweight feedback widget that creates GitHub Issues automatically. Drop a floating button onto any site — users submit feedback, and it becomes a GitHub Issue.

## How It Works

```
User clicks widget → fills form → POST to Cloudflare Worker → GitHub Issue created
```

## Quick Start

### 1. Deploy the API

```bash
cd apps/api

# Set your GitHub token
echo "GITHUB_TOKEN=ghp_xxxx" > .dev.vars

# Local dev
pnpm dev

# Deploy to Cloudflare
pnpm deploy
```

### 2. Add the Widget

**Standalone (no build step):**

```html
<script
  src="https://unpkg.com/@shiji/widget/dist/standalone.global.js"
  data-endpoint="https://shiji-api.your-worker.workers.dev"
  data-owner="your-github-username"
  data-repo="your-repo"
  data-labels="feedback"
></script>
```

**React:**

```bash
pnpm add @shiji/widget
```

```tsx
import { ShijiWidget } from "@shiji/widget";

function App() {
  return (
    <ShijiWidget
      endpoint="https://shiji-api.your-worker.workers.dev"
      owner="your-github-username"
      repo="your-repo"
      labels={["feedback"]}
    />
  );
}
```

**Imperative mount:**

```html
<script src="standalone.global.js"></script>
<script>
  Shiji.mount({
    endpoint: "https://shiji-api.your-worker.workers.dev",
    owner: "your-github-username",
    repo: "your-repo",
  });
</script>
```

## API

### `POST /actions/send`

```json
{
  "owner": "github-username",
  "repo": "repo-name",
  "data": {
    "title": "Bug report",
    "body": "Something is broken",
    "labels": ["feedback"]
  }
}
```

**Response (201):**

```json
{
  "success": true,
  "issueUrl": "https://github.com/owner/repo/issues/1",
  "issueNumber": 1
}
```

## Widget Config

| Property   | Type       | Required | Description                  |
| ---------- | ---------- | -------- | ---------------------------- |
| `endpoint` | `string`   | Yes      | URL of the deployed API      |
| `owner`    | `string`   | Yes      | GitHub repository owner      |
| `repo`     | `string`   | Yes      | GitHub repository name       |
| `labels`   | `string[]` | No       | Labels to add to the issue   |

## Theming

Override CSS custom properties on `.shiji-root`:

```css
.shiji-root {
  --shiji-primary: #6366f1;
  --shiji-primary-hover: #4f46e5;
  --shiji-bg: #ffffff;
  --shiji-border: #e5e7eb;
  --shiji-text: #111827;
  --shiji-text-secondary: #6b7280;
  --shiji-radius: 8px;
}
```

## Project Structure

```
shiji/
├── apps/api/          # Cloudflare Worker
│   └── src/
│       ├── index.ts       # Fetch handler
│       ├── cors.ts        # CORS helpers
│       ├── github.ts      # GitHub API client
│       ├── validation.ts  # Request validation
│       └── types.ts
├── packages/widget/   # React widget + standalone bundle
│   └── src/
│       ├── index.ts           # React entry
│       ├── standalone.ts      # IIFE entry with auto-mount
│       ├── components/
│       ├── hooks/
│       └── styles/
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

## Development

```bash
pnpm install
pnpm build

# Start API locally
echo "GITHUB_TOKEN=ghp_xxxx" > apps/api/.dev.vars
pnpm dev:api
```

## License

MIT
