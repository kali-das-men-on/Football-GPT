// Change this if your backend runs somewhere other than localhost:8000
const API_BASE = window.FOOTBALL_GPT_API_BASE || "http://localhost:8000";

const btn = document.getElementById("analyze-btn");
const input = document.getElementById("players");
const status = document.getElementById("status");
const results = document.getElementById("results");

btn.addEventListener("click", async () => {
  const players = input.value
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  if (players.length === 0) {
    status.textContent = "Enter at least one player name.";
    return;
  }

  btn.disabled = true;
  status.textContent = "Analyzing…";
  results.innerHTML = "";

  try {
    const response = await fetch(`${API_BASE}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ players }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || `Request failed (${response.status})`);
    }

    const data = await response.json();
    renderResults(data.analysis);
    status.textContent = "";
  } catch (err) {
    status.textContent = `Error: ${err.message}`;
  } finally {
    btn.disabled = false;
  }
});

function renderResults(analysis) {
  const overview = document.createElement("p");
  overview.className = "overall-summary";
  overview.textContent = analysis.overall_summary;
  results.appendChild(overview);

  analysis.players.forEach((player) => {
    const card = document.createElement("div");
    card.className = "player-card";
    card.innerHTML = `
      <h3>${escapeHtml(player.name)}</h3>
      <p class="score">Score: ${player.score}</p>
      <p>${escapeHtml(player.summary)}</p>
    `;
    results.appendChild(card);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}