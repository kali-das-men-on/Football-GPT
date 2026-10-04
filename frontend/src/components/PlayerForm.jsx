import { useState } from "react";

// A "controlled component": the textarea's value lives in React state
// (via the value/onChange props), not in the DOM itself. This is the
// core React concept that replaces manually reading input.value the way
// the old script.js did.
export default function PlayerForm({ onSubmit, loading }) {
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault(); // stops the browser's default full-page-reload form submit
    const players = text
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    onSubmit(players); // hands the parsed list up to App.jsx, which owns the actual request
  }

  return (
    <form className="input-panel" onSubmit={handleSubmit}>
      <label htmlFor="players">Players to compare (comma-separated)</label>
      <textarea
        id="players"
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Lionel Messi, Cristiano Ronaldo, Kylian Mbappe"
      />
      <button type="submit" disabled={loading}>
        {loading ? "Analyzing…" : "Analyze"}
      </button>
    </form>
  );
}
