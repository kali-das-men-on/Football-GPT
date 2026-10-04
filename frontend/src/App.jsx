import { useState } from "react";
import PlayerForm from "./components/PlayerForm.jsx";
import ResultsPanel from "./components/ResultsPanel.jsx";
import { analyzePlayers } from "./api.js";

// App.jsx is the "hub" component: it owns the three pieces of state the
// whole page depends on (the result, whether a request is in flight, and
// any error), and passes them down to the two child components as props.
// This is the direct replacement for the "idle / loading / success / failed"
// UI-state idea from the FastAPI hackathon guide -- here it's just React
// state instead of manually toggling classes and text.
export default function App() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(players) {
    if (players.length === 0) {
      setError("Enter at least one player name.");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzePlayers(players);
      setAnalysis(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className="site-header">
        <div className="title">Football GPT</div>
        <p className="tagline">AI-powered, Ballon d'Or-style player comparison</p>
      </header>

      <main className="container">
        <p className="intro">
          Football GPT compares footballers on goals, assists, form, and team
          impact, using a live stats lookup and an LLM-driven analysis.
        </p>

        <PlayerForm onSubmit={handleSubmit} loading={loading} />

        {error && <p className="status error">Error: {error}</p>}

        <ResultsPanel analysis={analysis} />
      </main>
    </>
  );
}
