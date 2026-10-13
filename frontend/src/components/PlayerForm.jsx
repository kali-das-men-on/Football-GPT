import { useState } from "react";
import { motion } from "motion/react";

export default function PlayerForm({ onSubmit, loading }) {
  const [text, setText] = useState("");
  function handleSubmit(event) {
    event.preventDefault();
    const players = [...new Set(text.split(",").map((name) => name.trim()).filter(Boolean))];
    onSubmit(players);
  }
  return <form className="input-panel" onSubmit={handleSubmit}>
    <label htmlFor="players">Players to compare <span className="label-muted">/ comma-separated</span></label>
    <textarea id="players" rows={3} value={text} onChange={(event) => setText(event.target.value)} placeholder={"Lionel Messi, Cristiano Ronaldo\nKylian Mbappé"} aria-describedby="player-input-hint" disabled={loading} />
    <motion.button type="submit" disabled={loading} whileTap={{ scale: .985 }}><span>{loading ? "Building comparison…" : "Run player analysis"}</span></motion.button>
    <span id="player-input-hint" className="sr-only">Separate player names with commas.</span>
  </form>;
}
