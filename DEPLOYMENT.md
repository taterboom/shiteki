# Shiteki Deployment Guide

## 1. Widget (`@taterboom/shiteki`)

### Publish to npm

```bash
# Build
cd packages/widget
pnpm build

# Login to npm (first time only)
npm login

# Publish (scoped packages are private by default, use --access public)
npm publish --access public
```

After publishing, the package is available at:
- npm: `npm install @taterboom/shiteki`
- unpkg CDN: `https://unpkg.com/@taterboom/shiteki/dist/standalone.global.js`
- jsDelivr CDN: `https://cdn.jsdelivr.net/npm/@taterboom/shiteki/dist/standalone.global.js`

### Usage via CDN (standalone, no bundler)

```html
<script src="https://unpkg.com/@taterboom/shiteki/dist/standalone.global.js"></script>
<script>
  Shiteki.mount({
    mode: "direct",
    endpoint: "",
    githubToken: "github_pat_xxx",
    owner: "your-username",
    repo: "your-repo",
    labels: ["feedback"],
  });
</script>
```

Or with `data-*` attributes for auto-mount:

```html
<script
  src="https://unpkg.com/@taterboom/shiteki/dist/standalone.global.js"
  data-mode="direct"
  data-github-token="github_pat_xxx"
  data-owner="your-username"
  data-repo="your-repo"
  data-labels="feedback"
></script>
```

### Usage via npm (React)

```bash
npm install @taterboom/shiteki
```

```tsx
import { ShitekiWidget } from "@taterboom/shiteki";

function App() {
  return (
    <ShitekiWidget
      mode="direct"
      endpoint=""
      githubToken="github_pat_xxx"
      owner="your-username"
      repo="your-repo"
      labels={["feedback"]}
    />
  );
}
```

### Version Update

Before each publish, bump the version:

```bash
cd packages/widget
npm version patch  # 0.1.0 → 0.1.1
# or
npm version minor  # 0.1.0 → 0.2.0
```

---

## 2. API Server (`shiteki-api`)

The API runs on **Cloudflare Workers**. Only needed when using `mode: "endpoint"`.

### Prerequisites

```bash
npm install -g wrangler
wrangler login
```

### Deploy

```bash
cd apps/api

# Set the GitHub token secret (one-time, or when rotating)
wrangler secret put GITHUB_TOKEN
# Paste your token when prompted

# Deploy
pnpm deploy
```

Wrangler will output the deployed URL, e.g. `https://shiteki-api.<your-subdomain>.workers.dev`.

### Custom Domain (optional)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → Workers & Pages → `shiteki-api`
2. Settings → Triggers → Add Custom Domain
3. Enter your domain (e.g. `api.shiteki.example.com`)

### Environment Variables

| Variable | How to set | Description |
|---|---|---|
| `GITHUB_TOKEN` | `wrangler secret put GITHUB_TOKEN` | GitHub PAT with Issues write permission |

The token is stored as an encrypted secret and never appears in code or config files.

### Local Development

```bash
cd apps/api

# Create .dev.vars for local secrets
echo "GITHUB_TOKEN=github_pat_xxx" > .dev.vars

pnpm dev
# → http://localhost:8787
```

---

## Quick Reference

| What | Command |
|---|---|
| Build widget | `cd packages/widget && pnpm build` |
| Publish widget | `cd packages/widget && npm publish --access public` |
| Deploy API | `cd apps/api && pnpm deploy` |
| Set API secret | `cd apps/api && wrangler secret put GITHUB_TOKEN` |
| Local dev (API) | `cd apps/api && pnpm dev` |
| Local dev (demo) | `cd apps/demo && pnpm dev` |
