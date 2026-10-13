const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.detail || data?.message || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  health: () => request("/api/health"),
  readiness: () => request("/api/health/readiness"),
  players: (search) =>
    request(`/api/football/players?search=${encodeURIComponent(search)}`),
  teams: (search) =>
    request(`/api/football/teams?search=${encodeURIComponent(search)}`),
  matches: (team) =>
    request(`/api/football/matches?team=${encodeURIComponent(team)}`),
  stats: (team) =>
    request(`/api/football/stats?team=${encodeURIComponent(team)}`),
  search: (q) =>
    request(`/api/football/search?q=${encodeURIComponent(q)}`),
  history: () => request("/api/history"),
};
