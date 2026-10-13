import { motion } from "motion/react";

export default function ResultsPanel({ analysis }) {
  if (!analysis) return null;
  const players = Array.isArray(analysis.players) ? analysis.players : [];
  return <section className="results" aria-live="polite">
    {analysis.overall_summary && <p className="overall-summary">{analysis.overall_summary}</p>}
    {players.map((player, index) => <motion.article className="player-card" key={`${player.name}-${index}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .32, delay: index * .07 }}>
      <h3>{player.name}</h3>{player.score !== undefined && player.score !== null && <p className="score">IMPACT SCORE / {player.score}</p>}{player.summary && <p>{player.summary}</p>}
    </motion.article>)}
    {!players.length && !analysis.overall_summary && <p className="overall-summary">The request completed, but the API returned no displayable player results.</p>}
  </section>;
}
