import { useEffect, useState } from "react";
import type { Interest } from "../about-data";
import PhotoCard from "./PhotoCard";

// a string sags between two ends; cards hang from it with little clips, and bulbs glow along it
const SAG = 46, EDGE = 8, H = 70;
const yAt = (t: number) => (1 - t) * (1 - t) * EDGE + 2 * (1 - t) * t * (EDGE + SAG * 2) + t * t * EDGE; // quadratic bezier
const BULBS = 13;

function useCols() {
  const q = () => (matchMedia("(max-width: 640px)").matches ? 2 : 3);
  const [cols, setCols] = useState(q);
  useEffect(() => {
    const m = matchMedia("(max-width: 640px)");
    const on = () => setCols(q());
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return cols;
}

export default function LightStrip({ items, compact = false }: { items: Interest[]; compact?: boolean }) {
  const cols = useCols();
  const rows: Interest[][] = [];
  for (let k = 0; k < items.length; k += cols) rows.push(items.slice(k, k + cols));

  return (
    <div className={"strip" + (compact ? " compact" : "")}>
      {rows.map((row, r) => (
        <div className="strip-row" key={r}>
          <svg className="strip-wire" viewBox={`0 0 100 ${H}`} preserveAspectRatio="none" aria-hidden="true">
            <path d={`M0 ${EDGE} Q50 ${EDGE + SAG * 2} 100 ${EDGE}`} vectorEffect="non-scaling-stroke" />
          </svg>
          {Array.from({ length: BULBS }, (_, b) => {
            const t = (b + 0.5) / BULBS;
            return <i className="bulb" key={b} aria-hidden="true" style={{ left: `${t * 100}%`, top: yAt(t), animationDelay: `${(b * 0.37 + r) % 2.4}s` }} />;
          })}
          <ul className="strip-cards">
            {row.map((it, k) => {
              const t = (k + 0.5) / cols;
              return (
                <li key={it.key} className="hang" style={{ left: `${t * 100}%`, top: yAt(t), animationDelay: `${-(k + r) * 0.9}s` }}>
                  <span className="clip" aria-hidden="true" />
                  <figure className="polaroid-card">
                    <PhotoCard src={it.photo} srcNight={it.photoNight} focus={it.focus} label={it.title} alt={it.title} />
                    <figcaption>
                      {it.caption}
                      {it.link && <> <a href={it.link.href} target="_blank" rel="noopener">{it.link.text}</a></>}
                    </figcaption>
                    {it.credit && <a className="credit-line mono" href={it.credit.href} target="_blank" rel="noopener">photo: {it.credit.text}</a>}
                  </figure>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
