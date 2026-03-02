# @taterboom/shiteki

Web annotation widget that closes the feedback loop with AI. Click any element on a page, add a comment — then either paste the structured prompt into Claude Code, or send it as a GitHub Issue.

## Installation

```bash
npm install @taterboom/shiteki
```

## Usage

### React

```tsx
import { ShitekiWidget } from "@taterboom/shiteki";

function App() {
  return (
    <ShitekiWidget
      owner="your-github-username"
      repo="your-repo"
      endpoint="https://your-api.workers.dev"
      labels={["shiteki"]}
    />
  );
}
```

### Standalone (CDN, no build step)

```html
<script
  src="https://unpkg.com/@taterboom/shiteki/dist/standalone.global.js"
  data-shiteki='{"endpoint":"https://your-api.workers.dev","owner":"your-github-username","repo":"your-repo"}'
></script>
```

You can also load the widget without config — annotation and copy features work immediately; GitHub Issue sending requires credentials configured via the Settings panel:

```html
<script
  src="https://unpkg.com/@taterboom/shiteki/dist/standalone.global.js"
  data-shiteki
></script>
```

### Imperative mount

```html
<script src="https://unpkg.com/@taterboom/shiteki/dist/standalone.global.js"></script>
<script>
  Shiteki.mount({
    endpoint: "https://your-api.workers.dev",
    owner: "your-github-username",
    repo: "your-repo",
  });
</script>
```

## Config

| Property         | Type       | Required | Description                                           |
| ---------------- | ---------- | -------- | ----------------------------------------------------- |
| `mode`           | `string`   | No       | `"endpoint"` (default) or `"direct"`                  |
| `endpoint`       | `string`   | Yes*     | URL of the deployed Cloudflare Worker API             |
| `githubToken`    | `string`   | Yes*     | GitHub PAT with `repo` scope (direct mode only)       |
| `owner`          | `string`   | Yes      | GitHub repository owner                               |
| `repo`           | `string`   | Yes      | GitHub repository name                                |
| `labels`         | `string[]` | No       | Labels to add to the created issue                    |
| `clearAfterCopy` | `boolean`  | No       | Clear annotations after copying the prompt            |

\* `endpoint` required for endpoint mode; `githubToken` required for direct mode.

### Modes

**Endpoint mode** (recommended): Routes GitHub API calls through your own Cloudflare Worker, keeping your token server-side.

**Direct mode**: Calls the GitHub API directly from the browser using a provided token. Suitable for internal tools where token exposure is acceptable.

## Toolbar Actions

Once annotations are added, the toolbar exposes these actions:

| Action | Keyboard | Description |
|--------|----------|-------------|
| **Copy** | `C` | Copies a structured markdown prompt — paste into Claude Code |
| **Send** | `S` | Creates a GitHub Issue with the annotation body |
| **Clear** | `X` | Removes all annotations |
| **Close** | `Esc` | Exits annotation mode |

Click a numbered marker to view/edit an annotation. `Cmd/Ctrl+Click` a marker to delete it.

## The Prompt Format

When you copy or send, Shiteki generates structured markdown with the full element context:

```markdown
# Visual Annotations

**Page:** [Dashboard](https://app.example.com/dashboard)
**Annotations:** 1
**Captured:** 2026-03-01T10:00:00.000Z

---

## Annotation #1

**What should change:**
> The button label is truncated on mobile screens

**Element:**
- Tag: `<button>`
- Text: "Submit Order"
- Selector: `#checkout > .actions > button.submit`
- Attributes: `class="submit btn-primary"`, `type="submit"`
```

The CSS selector lets AI tools (and `/fix-issue`) locate the exact element in code without guessing.

## Deploying the API

For endpoint mode, deploy the Cloudflare Worker in [`apps/api`](../../apps/api/):

```bash
cd apps/api
echo "GITHUB_TOKEN=ghp_xxxx" > .dev.vars
pnpm dev       # local
pnpm deploy    # production
```

Set the deployed Worker URL as your `endpoint`.

## Theming

Override CSS custom properties on `.shiteki-root`:

```css
.shiteki-root {
  --shiteki-primary: #6366f1;
  --shiteki-primary-hover: #4f46e5;
  --shiteki-bg: #ffffff;
  --shiteki-border: #e5e7eb;
  --shiteki-text: #111827;
  --shiteki-text-secondary: #6b7280;
  --shiteki-radius: 8px;
}
```

## License

MIT
