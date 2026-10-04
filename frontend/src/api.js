// The one file in this app that knows how to talk to the backend.
// Every component calls analyzePlayers() from here rather than calling
// fetch() directly -- if the API's URL or shape ever changes, this is
// the only file that needs to change.

// Vite exposes env vars prefixed with VITE_ via import.meta.env.
// Falls back to localhost:8000 for local development if VITE_API_BASE
// isn't set. See .env.example for how to override this for deployment.
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export async function analyzePlayers(players) {
  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ players }),
  });

  if (!response.ok) {
    // Mirrors the error-shape FastAPI's HTTPException sends: { "detail": "..." }
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed (${response.status})`);
  }

  const data = await response.json();
  return data.analysis; // the AnalysisResult shape: { players: [...], overall_summary }
}
