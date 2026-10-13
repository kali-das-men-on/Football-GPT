import { useEffect, useState } from "react";

export default function RouteStatus({ endpoint = "/api/health" }) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let active = true;

    fetch(endpoint)
      .then((response) => {
        if (!response.ok) throw new Error("API unavailable");
        return response.json();
      })
      .then(() => active && setStatus("online"))
      .catch(() => active && setStatus("offline"));

    return () => {
      active = false;
    };
  }, [endpoint]);

  return (
    <div className={`route-status ${status}`}>
      <span className="route-dot" />
      API {status}
    </div>
  );
}
