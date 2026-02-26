import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  base: "/shiteki/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@taterboom/shiteki": path.resolve(__dirname, "../../packages/widget/src/index.ts"),
    },
  },
});
