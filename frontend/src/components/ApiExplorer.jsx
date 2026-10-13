import { useState } from "react";

const routes = [
  ["GET", "/api/health"],
  ["GET", "/api/health/readiness"],
  ["GET", "/api/football/players?search=Messi"],
  ["GET", "/api/football/teams?search=Arsenal"],
  ["GET", "/api/football/matches?team=Arsenal"],
  ["GET", "/api/football/stats?team=Arsenal"],
  ["GET", "/api/football/search?q=Mbappe"],
  ["GET", "/api/analytics/overview"],
  ["GET", "/api/history"],
];

export default function ApiExplorer({ baseUrl = "" }) {
  const [selected, setSelected] = useState(routes[0]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(`${baseUrl}${selected[1]}`);
      const body = await response.json();
      setResult({ status: response.status, body });
    } catch (error) {
      setResult({ status: "error", body: { message: error.message } });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="api-explorer">
      <div className="api-explorer-list">
        {routes.map(([method, path]) => (
          <button
            key={path}
            className={path === selected[1] ? "active" : ""}
            onClick={() => setSelected([method, path])}
          >
            <b>{method}</b>
            <span>{path}</span>
          </button>
        ))}
      </div>

      <div className="api-explorer-panel">
        <div className="api-request">
          <span>{selected[0]}</span>
          <code>{selected[1]}</code>
          <button onClick={run} disabled={loading}>
            {loading ? "Running..." : "Run"}
          </button>
        </div>
        {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
      </div>
    </section>
  );
}
