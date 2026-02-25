import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    external: ["react", "react-dom", "motion", "motion/react"],
    injectStyle: true,
  },
  {
    entry: ["src/standalone.ts"],
    format: ["iife"],
    globalName: "Shiji",
    outExtension: () => ({ js: ".global.js" }),
    noExternal: ["react", "react-dom"],
    minify: true,
    injectStyle: true,
  },
]);
