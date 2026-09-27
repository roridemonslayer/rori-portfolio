import type { CSSProperties } from "react";

const STARS: CSSProperties[] = [
  { top: 90, left: "12%", width: 3, height: 3 },
  { top: 200, left: "34%", width: 2, height: 2, background: "#dfe6ff", animationDuration: "4.2s", animationDelay: ".7s" },
  { top: 140, left: "58%", width: 3, height: 3, animationDuration: "2.8s", animationDelay: "1.3s" },
  { top: 320, left: "80%", width: 2, height: 2, background: "#dfe6ff", animationDuration: "3.9s", animationDelay: ".3s" },
  { top: 420, left: "22%", width: 2, height: 2, animationDuration: "4.8s", animationDelay: "2s" },
  { top: 60, left: "88%", width: 2, height: 2, animationDuration: "3.1s", animationDelay: "1s" },
];
const LEAVES: CSSProperties[] = [
  { top: 120, width: 16, height: 10 },
  { top: 300, width: 12, height: 8, background: "var(--leaf2)", animationDuration: "21s", animationDelay: "5s" },
  { top: 60, width: 14, height: 9, background: "var(--leaf3)", animationDuration: "13s", animationDelay: "9s" },
  { top: 480, width: 15, height: 10, animationDuration: "18s", animationDelay: "12s" },
  { top: 220, width: 8, height: 8, background: "var(--leaf2)", animationDuration: "24s", animationDelay: "2s", opacity: "var(--star)" },
  { top: 400, width: 6, height: 6, background: "var(--leaf3)", animationDuration: "19s", animationDelay: "7s", opacity: "var(--star)" },
];

/* day meadow / night castle, twinkling stars (night), drifting leaves (day) / blowing stars (night) */
export default function Backdrop() {
  return (
    <>
      <div className="backdrop meadow" aria-hidden="true" />
      <div className="backdrop meadow-wash" aria-hidden="true" />
      <div className="backdrop castle" aria-hidden="true" />
      <div className="backdrop castle-wash" aria-hidden="true" />
      <div aria-hidden="true">{STARS.map((st, i) => <i key={i} className="star" style={st} />)}</div>
      <div aria-hidden="true">{LEAVES.map((st, i) => <i key={i} className="leaf" style={st} />)}</div>
    </>
  );
}
