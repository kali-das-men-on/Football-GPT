// A purely presentational component: it receives data via props and
// renders it. It holds no state of its own and knows nothing about
// fetch -- this separation (App fetches, ResultsPanel displays) is what
// makes each piece independently testable and reusable.
export default function ResultsPanel({ analysis }) {
  if (!analysis) return null; // nothing to show before the first search

  return (
    <section className="results">
      <p className="overall-summary">{analysis.overall_summary}</p>
      {analysis.players.map((player) => (
        // key is required by React whenever you render a list, so it can
        // track which item is which across re-renders. Player names are
        // a reasonable key here since this app sends one request per list.
        <div className="player-card" key={player.name}>
          <h3>{player.name}</h3>
          <p className="score">Score: {player.score}</p>
          <p>{player.summary}</p>
        </div>
      ))}
    </section>
  );
}
