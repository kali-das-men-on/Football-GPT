import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import PlayerForm from "./components/PlayerForm.jsx";
import ResultsPanel from "./components/ResultsPanel.jsx";
import { analyzePlayers } from "./api.js";

const features = [
  { number: "01", title: "Compare players", detail: "Side-by-side profiles and impact scores" },
  { number: "02", title: "Understand the game", detail: "AI-generated context, not just numbers" },
  { number: "03", title: "Make the argument", detail: "A clear summary of strengths and trade-offs" },
];

export default function App() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiState, setApiState] = useState("idle");

  async function handleSubmit(players) {
    if (!players.length) { setError("Enter at least one player name to start a comparison."); return; }
    setLoading(true); setApiState("loading"); setError(null); setAnalysis(null);
    try { setAnalysis(await analyzePlayers(players)); setApiState("success"); }
    catch (err) { setError(err.message || "The analysis could not be completed."); setApiState("error"); }
    finally { setLoading(false); }
  }

  return <div className="app-shell">
    <div className="ambient ambient-one" aria-hidden="true" /><div className="ambient ambient-two" aria-hidden="true" />
    <header className="topbar">
      <a className="brand" href="#" aria-label="Football GPT home"><span className="brand-mark">F<span>·</span>G</span><span>FOOTBALL<span className="brand-light">GPT</span></span></a>
      <div className="topbar-right"><span className={`status-dot ${apiState === "error" ? "status-dot-error" : ""}`} /><span className="system-label">{apiState === "loading" ? "ANALYZING" : apiState === "error" ? "CHECK CONNECTION" : "INTELLIGENCE ENGINE"}</span><span className="topbar-divider" /><span className="version-label">BETA / 01</span></div>
    </header>
    <main>
      <section className="hero">
        <motion.div className="hero-copy" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, ease: [ .22, 1, .36, 1 ] }}>
          <div className="eyebrow"><span className="eyebrow-line" /> THE BEAUTIFUL GAME, DECODED</div>
          <h1>Beyond the<br /><span className="headline-accent">scoreline.</span></h1>
          <p className="hero-description">Football intelligence that brings player data and AI analysis together. Compare the greats, challenge the narratives, see the game differently.</p>
          <div className="hero-meta"><span><i className="meta-icon">↗</i> Player comparisons</span><span><i className="meta-icon">✳</i> AI-powered analysis</span></div>
        </motion.div>
        <motion.div className="hero-visual" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .8, delay: .12 }}>
          <div className="visual-topline"><span>FIELD NOTES / 001</span><span>FIG. 01</span></div>
          <div className="pitch"><div className="pitch-line pitch-midline" /><div className="pitch-circle" /><div className="pitch-box pitch-box-left" /><div className="pitch-box pitch-box-right" />
            <motion.div className="player-point point-one" animate={{ y: [0, -7, 0] }} transition={{ duration: 3.1, repeat: Infinity, ease: "easeInOut" }}><span>10</span></motion.div>
            <motion.div className="player-point point-two" animate={{ y: [0, 6, 0] }} transition={{ duration: 3.7, repeat: Infinity, ease: "easeInOut" }}><span>07</span></motion.div>
            <motion.div className="player-point point-three" animate={{ y: [0, -5, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}><span>09</span></motion.div>
            <svg className="pass-path" viewBox="0 0 440 250" preserveAspectRatio="none" aria-hidden="true"><path d="M 70 176 Q 170 28 218 123 T 375 65" /></svg>
          </div>
          <div className="visual-caption"><span>TACTICAL VIEW</span><span className="caption-highlight">READ THE GAME, NOT JUST THE NUMBERS.</span></div>
        </motion.div>
      </section>
      <section className="workspace" id="compare">
        <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> THE COMPARISON LAB</div><h2>Make your case.</h2></div><p>Two or more players. One deeper conversation.</p></div>
        <div className="workspace-grid">
          <motion.div className="form-card" whileHover={{ borderColor: "rgba(214,255,97,.32)" }} transition={{ duration: .2 }}><div className="card-topline"><span>INPUT / PLAYERS</span><span>01 — 03</span></div><PlayerForm onSubmit={handleSubmit} loading={loading} /><div className="form-footnote"><span className="tiny-lock">✳</span> Analysis is generated on request. Results may depend on data availability.</div></motion.div>
          <div className="output-card"><div className="card-topline"><span>OUTPUT / ANALYSIS</span><span>{loading ? "PROCESSING" : analysis ? "COMPLETE" : "AWAITING INPUT"}</span></div>
            <AnimatePresence mode="wait">
              {loading ? <motion.div key="loading" className="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><div className="loading-orbit"><span /><span /><span /></div><h3>Reading the game.</h3><p>Pulling the threads together. Great analysis takes a moment.</p></motion.div>
              : error ? <motion.div key="error" className="error-state" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><span className="error-symbol">!</span><h3>Analysis interrupted</h3><p>{error}</p><button className="text-button" onClick={() => setError(null)}>Dismiss ↗</button></motion.div>
              : analysis ? <motion.div key="results" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}><ResultsPanel analysis={analysis} /></motion.div>
              : <motion.div key="empty" className="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><div className="empty-glyph">↗</div><h3>Your next debate starts here.</h3><p>Submit players to see the AI breakdown, individual assessments, and overall comparison.</p><div className="output-tags"><span>PLAYER PROFILE</span><span>IMPACT SCORE</span><span>AI SUMMARY</span></div></motion.div>}
            </AnimatePresence>
          </div>
        </div>
      </section>
      <section className="feature-strip">{features.map((feature, index) => <motion.article className="feature-item" key={feature.number} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .4 }} transition={{ delay: index * .1, duration: .45 }}><span className="feature-number">{feature.number}</span><h3>{feature.title}</h3><p>{feature.detail}</p><span className="feature-arrow">↗</span></motion.article>)}</section>
    </main>
    <footer className="footer"><a className="brand footer-brand" href="#"><span className="brand-mark">F<span>·</span>G</span><span>FOOTBALL<span className="brand-light">GPT</span></span></a><span>BUILT FOR THE LOVE OF THE GAME.</span><span>DATA × CONTEXT × INTELLIGENCE</span></footer>
  </div>;
}
