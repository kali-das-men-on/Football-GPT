import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Standard Vite + React setup. The dev server runs on http://localhost:5173
// by default -- that's the origin your FastAPI backend's CORS settings
// need to allow (allow_origins=["*"] already covers it; see README-react.md
// for tightening this once you deploy).
export default defineConfig({
  plugins: [react()],
});
