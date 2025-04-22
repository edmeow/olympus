import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import fs from "node:fs";

const pdfjsDistPath = path.dirname(path.resolve("node_modules/pdfjs-dist/package.json"));
const pdfWorkerPath = path.join(pdfjsDistPath, "build", "pdf.worker.mjs");

fs.cpSync(pdfWorkerPath, "./dist/pdf.worker.mjs", { recursive: true });

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
  },
});
