import { useEffect, useRef, useState } from "react";
import "./InteractiveHero.css";

export default function InteractiveHero() {
  const ref = useRef(null);
  const [pointer, setPointer] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const move = (event) => {
      const rect = node.getBoundingClientRect();
      setPointer({
        x: ((event.clientX - rect.left) / rect.width) * 100,
        y: ((event.clientY - rect.top) / rect.height) * 100,
      });
    };

    node.addEventListener("pointermove", move);
    return () => node.removeEventListener("pointermove", move);
  }, []);

  return (
    <section
      ref={ref}
      className="interactive-hero"
      style={{
        "--mx": `${pointer.x}%`,
        "--my": `${pointer.y}%`,
      }}
    >
      <div className="hero-grid" />
      <div className="hero-glow" />
      <div className="hero-content">
        <span className="hero-kicker">AI FOOTBALL INTELLIGENCE</span>
        <h1>Ask Football-GPT.</h1>
        <p>
          Explore players, teams, matches and tactical questions through an
          agent that can combine football data with language reasoning.
        </p>
        <div className="hero-pills">
          <span>React</span>
          <span>FastAPI</span>
          <span>LangChain</span>
          <span>Multi-model</span>
        </div>
      </div>
    </section>
  );
}
