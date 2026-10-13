import { useEffect, useState } from "react";

export default function CursorSpotlight() {
  const [position, setPosition] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const onMove = (event) => setPosition({ x: event.clientX, y: event.clientY });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="cursor-spotlight"
      style={{
        transform: `translate3d(${position.x - 180}px, ${position.y - 180}px, 0)`,
      }}
    />
  );
}
