# Shiteki (指摘)

Lightweight visual annotation widget that turns user feedback into GitHub Issues. Drop a floating button onto any site — users click elements, add comments, and it becomes a structured GitHub Issue.

## Quick Start

```bash
npm install @taterboom/shiteki
```

```tsx
import { ShitekiWidget } from "@taterboom/shiteki";

<ShitekiWidget
  endpoint="https://your-api.workers.dev"
  owner="your-github-username"
  repo="your-repo"
/>
```

Or drop a single script tag (no build step):

```html
<script
  src="https://unpkg.com/@taterboom/shiteki/dist/standalone.global.js"
  data-shiteki='{"endpoint":"https://your-api.workers.dev","owner":"your-github-username","repo":"your-repo"}'
></script>
```

See [full documentation](packages/widget/) for all config options, theming, and usage modes.

## Packages

| Package | Description |
|---------|-------------|
| [`@taterboom/shiteki`](packages/widget/) | React widget + standalone bundle ([npm](https://www.npmjs.com/package/@taterboom/shiteki)) |
| [`shiteki-api`](apps/api/) | Cloudflare Worker proxy for GitHub API |
| [`shiteki-demo`](apps/demo/) | Demo application |

## Project Structure

```
shiteki/
├── apps/api/          # Cloudflare Worker
│   └── src/
│       ├── index.ts       # Fetch handler
│       ├── cors.ts        # CORS helpers
│       ├── github.ts      # GitHub API client
│       ├── validation.ts  # Request validation
│       └── types.ts
├── apps/demo/         # Demo application
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

# Start demo
pnpm dev:demo

# Develop widget with watch mode
pnpm dev:widget
```

## License

MIT
