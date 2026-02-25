import { ShijiWidget } from "@shiji/widget";

export function App() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", color: "#111827" }}>
      {/* Hero section */}
      <header
        style={{
          padding: "64px 24px 48px",
          textAlign: "center",
          background: "linear-gradient(135deg, #eff6ff, #f0fdf4)",
        }}
      >
        <h1 id="hero-title" style={{ fontSize: 40, margin: 0 }}>
          Shiji Annotation Demo
        </h1>
        <p style={{ color: "#6b7280", fontSize: 18, marginTop: 12 }}>
          Click the crosshair in the toolbar below, then click any element to annotate it.
        </p>
        <button
          data-testid="hero-cta"
          style={{
            marginTop: 24,
            padding: "12px 32px",
            fontSize: 16,
            fontWeight: 600,
            border: "none",
            borderRadius: 8,
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Get Started
        </button>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
        {/* Features grid */}
        <section>
          <h2>Features</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 20,
              marginTop: 16,
            }}
          >
            {[
              { title: "Element Picker", desc: "Click any UI element to select it for annotation." },
              { title: "Visual Markers", desc: "Numbered markers appear at each annotated element." },
              { title: "Structured Output", desc: "Generates a clean markdown prompt with all annotations." },
              { title: "GitHub Integration", desc: "Send annotations directly as GitHub Issues." },
            ].map((f) => (
              <div
                key={f.title}
                role="article"
                style={{
                  padding: 20,
                  background: "#f9fafb",
                  borderRadius: 10,
                  border: "1px solid #e5e7eb",
                }}
              >
                <h3 style={{ margin: "0 0 8px" }}>{f.title}</h3>
                <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sample form */}
        <section style={{ marginTop: 48 }}>
          <h2>Sample Form</h2>
          <form
            onSubmit={(e) => e.preventDefault()}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              maxWidth: 400,
              marginTop: 16,
            }}
          >
            <label style={{ fontWeight: 500 }}>
              Name
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                style={{
                  display: "block",
                  width: "100%",
                  marginTop: 4,
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  fontSize: 14,
                  boxSizing: "border-box",
                }}
              />
            </label>
            <label style={{ fontWeight: 500 }}>
              Email
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                style={{
                  display: "block",
                  width: "100%",
                  marginTop: 4,
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  fontSize: 14,
                  boxSizing: "border-box",
                }}
              />
            </label>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                background: "#111827",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                alignSelf: "flex-start",
              }}
            >
              Submit
            </button>
          </form>
        </section>

        {/* Navigation sample */}
        <section style={{ marginTop: 48 }}>
          <h2>Sample Navigation</h2>
          <nav
            style={{
              display: "flex",
              gap: 16,
              marginTop: 16,
              padding: 16,
              background: "#111827",
              borderRadius: 8,
            }}
          >
            {["Home", "Products", "About", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{ color: "#e5e7eb", textDecoration: "none", fontSize: 14 }}
              >
                {item}
              </a>
            ))}
          </nav>
        </section>

        {/* Table sample */}
        <section style={{ marginTop: 48, marginBottom: 120 }}>
          <h2>Sample Table</h2>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: 16,
              fontSize: 14,
            }}
          >
            <thead>
              <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                <th style={{ textAlign: "left", padding: "8px 12px" }}>Name</th>
                <th style={{ textAlign: "left", padding: "8px 12px" }}>Role</th>
                <th style={{ textAlign: "left", padding: "8px 12px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Alice", role: "Engineer", status: "Active" },
                { name: "Bob", role: "Designer", status: "Active" },
                { name: "Carol", role: "PM", status: "Away" },
              ].map((row) => (
                <tr key={row.name} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "8px 12px" }}>{row.name}</td>
                  <td style={{ padding: "8px 12px" }}>{row.role}</td>
                  <td style={{ padding: "8px 12px" }}>
                    <span
                      style={{
                        padding: "2px 10px",
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 500,
                        background: row.status === "Active" ? "#d1fae5" : "#fef3c7",
                        color: row.status === "Active" ? "#065f46" : "#92400e",
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      <ShijiWidget
        mode="endpoint"
        endpoint="http://localhost:8787"
        githubToken=""
        owner="taterboom"
        repo="shiji"
        labels={["annotation"]}
      />
    </div>
  );
}
