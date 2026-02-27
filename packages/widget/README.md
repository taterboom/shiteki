# Shiteki (指摘)

Lightweight visual annotation widget that turns user feedback into GitHub Issues.

## Installation

```bash
npm install @taterboom/shiteki
```

Or via CDN (no build step):

```html
<script src="https://unpkg.com/@taterboom/shiteki/dist/standalone.global.js"></script>
```

## Usage

### React

```tsx
import { ShitekiWidget } from "@taterboom/shiteki";

function App() {
  return (
    <ShitekiWidget
      endpoint="https://your-api.workers.dev"
      owner="your-github-username"
      repo="your-repo"
      labels={["feedback"]}
    />
  );
}
```

### Standalone (CDN with auto-mount)

Add a `data-shiteki` attribute with a JSON config:

```html
<script
  src="https://unpkg.com/@taterboom/shiteki/dist/standalone.global.js"
  data-shiteki='{"endpoint":"https://your-api.workers.dev","owner":"your-github-username","repo":"your-repo"}'
></script>
```

You can also mount with no config — the widget will load with annotation & copy features enabled, but send will be disabled until configured via settings:

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

`Shiteki.mount()` can also be called with no arguments.

## Config

| Property      | Type       | Required | Description                      |
| ------------- | ---------- | -------- | -------------------------------- |
| `mode`        | `string`   | No       | `"endpoint"` or `"direct"`       |
| `endpoint`    | `string`   | Yes*     | URL of the deployed API          |
| `githubToken` | `string`   | Yes*     | GitHub PAT (direct mode only)    |
| `owner`       | `string`   | Yes      | GitHub repository owner          |
| `repo`        | `string`   | Yes      | GitHub repository name           |
| `labels`      | `string[]` | No       | Labels to add to the issue       |

\* `endpoint` is required for endpoint mode, `githubToken` for direct mode.

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
