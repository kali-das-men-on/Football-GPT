import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

function App() {
const [input, setInput] = useState("");
const [result, setResult] = useState(null);
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

async function handleSubmit(event) {
    event.preventDefault();

    const players = input
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

    if (!players.length) {
    setError("Enter at least one player name.");
    return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
    const response = await fetch("http://127.0.0.1:8000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ players }),
    });

    if (!response.ok) {
        throw new Error(`Request failed (${response.status}). Check the API and try again.`);
    }

    setResult(await response.json());
    } catch (err) {
    setError(err.message || "Could not connect to the backend.");
    } finally {
    setLoading(false);
    }
}

return (
    <main className="app">
    <header className="site-header">
        <div className="brand-mark" aria-hidden="true">⚽</div>
        <div>
        <p className="eyebrow">PLAYER COMPARISON</p>
        <h1>Football GPT</h1>
        </div>
    </header>

    <section className="hero">
        <p className="eyebrow">THE GAME, IN CONTEXT</p>
        <h2>Compare the players.<br />See the bigger picture.</h2>
        <p className="intro">
        Get an AI-generated comparison using player information and stats.
        </p>

        <form className="input-panel" onSubmit={handleSubmit}>
        <label htmlFor="players">Players to compare</label>
        <textarea
            id="players"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Lionel Messi, Cristiano Ronaldo, Kylian Mbappé"
            rows={3}
        />
        <div className="form-footer">
            <span>Separate names with commas</span>
            <button type="submit" disabled={loading}>
            {loading ? "Analyzing…" : "Analyze players"}
            </button>
        </div>
        </form>

        {error && <p className="error" role="alert">{error}</p>}
        {loading && <p className="status" role="status">Gathering player information…</p>}
    </section>

    {result && (
        <section className="results" aria-live="polite">
        <h2>Analysis</h2>
        {result.overall_summary && (
            <p className="overall-summary">{result.overall_summary}</p>
        )}
        <div className="player-grid">
            {(result.players || []).map((player, index) => (
            <article className="player-card" key={`${player.name}-${index}`}>
                <h3>{player.name}</h3>
                <p>{player.summary}</p>
                <strong>Score: {player.score}</strong>
            </article>
            ))}
        </div>
        </section>
    )}
    </main>
);
}

createRoot(document.getElementById("root")).render(
<React.StrictMode>
    <App />
</React.StrictMode>
);