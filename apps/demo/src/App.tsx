import { ShitekiWidget } from "@taterboom/shiteki";

function CodeBlock({ lang, children }: { lang: string; children: React.ReactNode }) {
  return (
    <div className="relative">
      <span className="absolute top-3 right-3 text-xs text-gray-500">{lang}</span>
      <pre className="bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  );
}

const FEATURES = [
  { emoji: "🎯", title: "Element Picker", desc: "Click any UI element to select it for annotation." },
  { emoji: "📌", title: "Visual Markers", desc: "Numbered markers appear at each annotated element." },
  { emoji: "📋", title: "Structured Output", desc: "Generates a clean markdown prompt with all annotations." },
  { emoji: "🔗", title: "GitHub Integration", desc: "Send annotations directly as GitHub Issues." },
];

const SHORTCUTS = [
  { key: "X", desc: "Toggle widget" },
  { key: "C", desc: "Copy to clipboard" },
  { key: "S", desc: "Send as Issue" },
  { key: "DD", desc: "Clear all" },
  { key: "Esc", desc: "Close" },
  { key: "⌘+Click", desc: "Remove annotation" },
];

const CONFIG = [
  { prop: "mode", type: "string", required: "No", desc: '"endpoint" or "direct"' },
  { prop: "endpoint", type: "string", required: "Yes*", desc: "URL of the deployed API" },
  { prop: "githubToken", type: "string", required: "Yes*", desc: "GitHub PAT (direct mode only)" },
  { prop: "owner", type: "string", required: "Yes", desc: "GitHub repository owner" },
  { prop: "repo", type: "string", required: "Yes", desc: "GitHub repository name" },
  { prop: "labels", type: "string[]", required: "No", desc: "Labels to add to the issue" },
];

export function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 font-bold text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256" fill="currentColor">
              <path d="M 247.81,77.89 C 245.98,73.37 241.11,74.53 235.48,73.96 C 227.24,73.12 223.31,71.04 220.48,70.11 C 216.92,68.91 215.26,71.07 214.61,74.16 C 213.26,80.65 209.08,85.14 208.17,87.42 C 206.52,91.71 209.63,96.73 218.18,97.13 C 232.12,97.81 250.88,87.09 247.81,77.89 Z" />
              <path d="M 226.81,110.84 C 226.56,106.67 226.51,105.11 226.15,104.34 C 225.84,103.66 225.86,103.98 225.16,104.13 C 223.16,104.58 214.15,105.42 207.69,101.21 C 202.06,97.59 198.08,90.98 201.42,84.48 C 203.75,79.86 206.15,78.28 208.27,70.79 C 209.83,65.03 211.98,64.17 214.19,63.26 C 214.85,62.97 214.62,62.88 214.25,61.79 C 212.98,58.57 197.91,22.25 154.31,22.25 C 120.74,22.25 99.34,43.86 90.92,75.12 C 86.39,92.17 82.95,108.72 64.16,108.72 C 54.19,108.08 48.41,104.41 43.82,98.75 C 36.81,91.63 33.06,87.11 24.09,87.11 C 12.17,87.11 7.88,109.92 7.88,130.65 C 7.88,173.15 36.13,232.54 115.14,232.54 C 179.88,232.54 230.95,189.87 226.81,110.84 Z M 181.96,59.19 C 187.91,59.19 189.92,66.52 189.92,70.09 C 189.92,76.29 187.29,81.66 182.58,81.66 C 176.84,81.66 173.79,74.91 173.79,70.09 C 173.79,64.72 176.27,59.19 181.96,59.19 Z M 109.32,193.56 C 92.41,193.56 75.41,185.76 75.41,175.28 C 75.41,173.21 76.03,171.74 76.52,170.31 C 67.56,166.67 57.66,157.68 57.66,146.48 C 57.66,138.16 63.95,135.45 69.89,134.75 C 79.11,133.59 86.92,131.94 96.76,131.09 C 98.17,130.97 97.19,132.06 96.41,132.49 C 88.26,137.11 79.68,138.83 72.02,140.57 C 67.22,141.66 64.78,143.11 64.78,146.13 C 64.78,153.75 73.75,163.71 89.46,167.81 C 89.82,167.93 89.68,168.28 89.41,168.36 C 86.07,169.52 83.07,171.91 83.07,175.13 C 83.07,182.39 95.68,186.48 108.05,186.48 C 129.97,186.48 145.81,172.16 149.31,153.37 C 149.81,150.85 149.76,149.48 150.29,149.48 C 151.12,149.48 151.37,153.81 151.37,155.58 C 151.37,173.91 134.62,193.56 109.32,193.56 Z" />
            </svg>
            Shiteki <span className="text-gray-400 font-normal text-sm">(指摘)</span>
          </a>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-6">
              <a href="#features" className="text-sm text-gray-500 hover:text-gray-900 transition">Features</a>
              <a href="#install" className="text-sm text-gray-500 hover:text-gray-900 transition">Install</a>
              <a href="#config" className="text-sm text-gray-500 hover:text-gray-900 transition">Config</a>
              <a href="#try" className="text-sm text-gray-500 hover:text-gray-900 transition">Try It</a>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://www.npmjs.com/package/@taterboom/shiteki"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full hover:bg-red-100 transition"
              >
                npm
              </a>
              <a
                href="https://github.com/taterboom/shiteki"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full hover:bg-gray-200 transition"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-12 sm:pt-32 sm:pb-16 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
            Visual annotations that become GitHub Issues
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 mt-6 max-w-2xl mx-auto">
            Drop a floating button onto any site — users click elements, add comments, and it becomes a structured GitHub Issue.
          </p>
          <div className="flex items-center justify-center gap-4 mt-10">
            <a
              href="#install"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-sm"
            >
              Get Started
            </a>
            <a
              href="https://github.com/taterboom/shiteki"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition text-sm"
            >
              GitHub
            </a>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
            <span>Press</span>
            <kbd className="inline-flex items-center justify-center w-7 h-7 bg-white border border-gray-200 rounded-md font-mono text-xs font-semibold text-gray-600 shadow-sm animate-pulse">
              X
            </kbd>
            <span>to try it on this page</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition"
            >
              <span className="text-2xl">{f.emoji}</span>
              <h3 className="font-semibold text-gray-900 mt-3">{f.title}</h3>
              <p className="text-sm text-gray-500 mt-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Installation */}
      <section id="install" className="py-20 max-w-3xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-900">Installation</h2>
        <div className="space-y-12 mt-8">
          {/* React */}
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              React
            </h3>
            <div className="mt-4 space-y-3">
              <CodeBlock lang="bash">npm install @taterboom/shiteki</CodeBlock>
              <CodeBlock lang="tsx">
                <span className="text-purple-400">import</span>{" "}
                {"{ "}
                <span className="text-yellow-300">ShitekiWidget</span>
                {" }"}{" "}
                <span className="text-purple-400">from</span>{" "}
                <span className="text-green-400">"@taterboom/shiteki"</span>;{"\n"}
                {"\n"}
                <span className="text-blue-400">{"<"}</span>
                <span className="text-yellow-300">ShitekiWidget</span>{"\n"}
                {"  "}
                <span className="text-purple-300">endpoint</span>
                =<span className="text-green-400">"https://your-api.workers.dev"</span>{"\n"}
                {"  "}
                <span className="text-purple-300">owner</span>
                =<span className="text-green-400">"your-username"</span>{"\n"}
                {"  "}
                <span className="text-purple-300">repo</span>
                =<span className="text-green-400">"your-repo"</span>{"\n"}
                <span className="text-blue-400">/{">"}</span>
              </CodeBlock>
            </div>
          </div>

          {/* CDN */}
          <div>
            <h3 className="font-semibold text-gray-900">CDN (no build step)</h3>
            <div className="mt-4">
              <CodeBlock lang="html">
                <span className="text-blue-400">{"<"}</span>
                <span className="text-red-400">script</span>{"\n"}
                {"  "}
                <span className="text-purple-300">src</span>
                =<span className="text-green-400">"https://unpkg.com/@taterboom/shiteki/dist/standalone.global.js"</span>{"\n"}
                {"  "}
                <span className="text-purple-300">data-shiteki</span>
                =<span className="text-green-400">{`'{"endpoint":"https://your-api.workers.dev","owner":"your-username","repo":"your-repo"}'`}</span>{"\n"}
                <span className="text-blue-400">{"></"}</span>
                <span className="text-red-400">script</span>
                <span className="text-blue-400">{">"}</span>
              </CodeBlock>
            </div>
          </div>

          {/* Imperative */}
          <div>
            <h3 className="font-semibold text-gray-900">Imperative</h3>
            <div className="mt-4">
              <CodeBlock lang="html">
                <span className="text-blue-400">{"<"}</span>
                <span className="text-red-400">script</span>
                {" "}
                <span className="text-purple-300">src</span>
                =<span className="text-green-400">"https://unpkg.com/@taterboom/shiteki/dist/standalone.global.js"</span>
                <span className="text-blue-400">{"></"}</span>
                <span className="text-red-400">script</span>
                <span className="text-blue-400">{">"}</span>{"\n"}
                <span className="text-blue-400">{"<"}</span>
                <span className="text-red-400">script</span>
                <span className="text-blue-400">{">"}</span>{"\n"}
                {"  "}Shiteki.<span className="text-yellow-300">mount</span>({"{"}{"\n"}
                {"    "}
                <span className="text-purple-300">endpoint</span>: <span className="text-green-400">"https://your-api.workers.dev"</span>,{"\n"}
                {"    "}
                <span className="text-purple-300">owner</span>: <span className="text-green-400">"your-username"</span>,{"\n"}
                {"    "}
                <span className="text-purple-300">repo</span>: <span className="text-green-400">"your-repo"</span>,{"\n"}
                {"  "}{"}"});{"\n"}
                <span className="text-blue-400">{"</"}</span>
                <span className="text-red-400">script</span>
                <span className="text-blue-400">{">"}</span>
              </CodeBlock>
            </div>
          </div>
        </div>
      </section>

      {/* Keyboard Shortcuts */}
      <section className="py-16 max-w-3xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-900">Keyboard Shortcuts</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8">
          {SHORTCUTS.map((s) => (
            <div
              key={s.key}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
            >
              <kbd className="inline-flex items-center justify-center min-w-[2rem] h-7 px-2 bg-white border border-gray-200 rounded-md font-mono text-xs font-semibold text-gray-700 shadow-sm">
                {s.key}
              </kbd>
              <span className="text-sm text-gray-500">{s.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Try It Out */}
      <section id="try" className="py-20 max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-center text-gray-900">Try it out</h2>
        <p className="text-gray-500 text-center mt-2 max-w-xl mx-auto">
          This page has Shiteki running. Click the floating button in the bottom-right corner, then click any element to start annotating.
        </p>

        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 mt-10 space-y-10">
          {/* Sample Form */}
          <div>
            <h3 className="font-semibold text-lg text-gray-900">Contact Form</h3>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-3 max-w-sm mt-4"
            >
              <label className="text-sm font-medium text-gray-700">
                Name
                <input
                  type="text"
                  placeholder="John Doe"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Email
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </label>
              <button
                type="submit"
                className="self-start px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Sample Navigation */}
          <div>
            <h3 className="font-semibold text-lg text-gray-900">Navigation</h3>
            <nav className="flex gap-6 mt-4 bg-gray-900 rounded-lg p-4">
              {["Home", "Products", "About", "Contact"].map((item) => (
                <a
                  key={item}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-300 hover:text-white text-sm transition"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Sample Table */}
          <div>
            <h3 className="font-semibold text-lg text-gray-900">Data Table</h3>
            <table className="w-full text-sm mt-4">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-2 px-3 font-medium text-gray-500">Name</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500">Role</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Alice", role: "Engineer", status: "Active" },
                  { name: "Bob", role: "Designer", status: "Active" },
                  { name: "Carol", role: "PM", status: "Away" },
                ].map((row) => (
                  <tr key={row.name} className="border-b border-gray-100">
                    <td className="py-2 px-3">{row.name}</td>
                    <td className="py-2 px-3">{row.role}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          row.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 mt-20">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-gray-400">Shiteki (指摘) — MIT License</span>
          <div className="flex gap-6 text-sm text-gray-400">
            <a
              href="https://www.npmjs.com/package/@taterboom/shiteki"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition"
            >
              npm
            </a>
            <a
              href="https://github.com/taterboom/shiteki"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>

      <ShitekiWidget
        mode="endpoint"
        endpoint="https://shiteki-api.xuebagod.workers.dev"
        githubToken=""
        owner="taterboom"
        repo="shiteki"
        labels={["demo"]}
      />
    </div>
  );
}
