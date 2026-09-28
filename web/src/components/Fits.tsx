import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/* my fits: the real photos (public/fits/) as a sideways row of polaroids.
   Click one to open it with a breakdown of the pieces. Add brands to `pieces` as "piece · brand". */
type Fit = { file: string; caption: string; line: string; pieces: string[] };
const FITS: Fit[] = [
  { file: "puffer", caption: "puffer season", line: "full winter armor.",
    pieces: ["black hooded puffer with a fur-trimmed hood", "cream wide-leg pants with paneled, stacked seams", "black gloves", "black boots"] },
  { file: "fur-collar", caption: "fur collar", line: "a warm day in the city, dressed for fall anyway.",
    pieces: ["black beanie", "black shades", "brown leather jacket with a shaggy fur collar", "dark charcoal baggy jeans", "white sneakers"] },
  { file: "blue-zip", caption: "blue zip-up in the snow", line: "cobalt against the grey.",
    pieces: ["cobalt blue zip-up hoodie with white stripes", "hood up", "washed camo cargo pants", "grey sneakers"] },
  { file: "pink-scarf", caption: "pink scarf", line: "soft colors on cobblestone.",
    pieces: ["grey knit beanie", "tinted shades", "cream and pink printed jacket", "long pink plaid scarf", "light-wash baggy jeans", "white sneakers"] },
  { file: "plaid-cap", caption: "plaid + cap", line: "a little mischief with a lamp post.",
    pieces: ["light blue cap", "blue plaid overshirt", "washed, faded cargo pants", "brown shoes"] },
  { file: "newsboy", caption: "newsboy", line: "fitting room mirror selfie, obviously.",
    pieces: ["brown newsboy cap", "shades", "dark denim trucker jacket", "white collared shirt and tie", "brown pleated wide trousers"] },
  { file: "orange-beanie", caption: "orange beanie", line: "sunny day, loud colors.",
    pieces: ["orange beanie", "shades", "blue graphic tee", "rainbow plaid shorts", "white socks", "blue sneakers"] },
];
const TILTS = [-2, 1.5, -1, 2, -1.5, 1, -2.5];

export default function Fits() {
  const row = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  // hide an arrow when there's nowhere left to go that way
  const syncArrows = () => {
    const r = row.current;
    if (!r) return;
    setAtStart(r.scrollLeft <= 4);
    setAtEnd(r.scrollLeft + r.clientWidth >= r.scrollWidth - 4);
  };
  useEffect(() => {
    syncArrows();
    addEventListener("resize", syncArrows);
    return () => removeEventListener("resize", syncArrows);
  }, []);

  // one big glide per click: a whole screenful of fits (minus a sliver so you keep your place)
  const slide = (dir: number) => {
    const r = row.current;
    if (r) r.scrollBy({ left: dir * Math.max(276, r.clientWidth - 120), behavior: "smooth" });
  };

  useEffect(() => {
    if (open === null) return;
    closeBtn.current?.focus();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      else if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % FITS.length));
      else if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o - 1 + FITS.length) % FITS.length));
    };
    addEventListener("keydown", onKey);
    return () => { removeEventListener("keydown", onKey); document.documentElement.style.overflow = ""; };
  }, [open]);

  const f = open === null ? null : FITS[open];
  return (
    <section id="fits" className="section" aria-labelledby="fits-t">
      <div className="sec-head">
        <span className="num">04</span>
        <h2 id="fits-t">My fits</h2>
        <span className="aside">fashion is half the fun</span>
      </div>
      <div className="fit-wrap">
        {!atStart && <button type="button" className="fit-arrow prev" aria-label="Previous fits" onClick={() => slide(-1)}>←</button>}
        {!atEnd && <button type="button" className="fit-arrow next" aria-label="More fits" onClick={() => slide(1)}>→</button>}
        <ul className="fit-row" ref={row} onScroll={syncArrows}>
          {FITS.map((fit, k) => (
            <li key={fit.file} style={{ rotate: `${TILTS[k % TILTS.length]}deg` }}>
              <button type="button" className="fit-open" onClick={() => setOpen(k)} aria-label={`Open ${fit.caption}`}>
                <figure className="polaroid-card">
                  <div className="fit-photo"><img src={`/fits/${fit.file}.jpg`} alt={`Outfit: ${fit.caption}`} loading="lazy" onLoad={syncArrows} /></div>
                  <figcaption>{fit.caption}</figcaption>
                </figure>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* portaled to <body>: the section's fade-in transform would otherwise trap position: fixed */}
      {f && open !== null && createPortal(
        <div className="fit-modal" role="dialog" aria-modal="true" aria-labelledby="fit-modal-t" onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}>
          <div className="fit-sheet">
            <img src={`/fits/${f.file}.jpg`} alt={`Outfit: ${f.caption}`} />
            <div className="fit-info">
              <button type="button" className="fit-close" ref={closeBtn} aria-label="Close" onClick={() => setOpen(null)}>✕</button>
              <div className="fit-count mono">{String(open + 1).padStart(2, "0")} / {String(FITS.length).padStart(2, "0")}</div>
              <h3 id="fit-modal-t">{f.caption}</h3>
              <p className="fit-line">{f.line}</p>
              <div className="fit-label mono">the pieces</div>
              <ul className="fit-pieces">{f.pieces.map((p) => <li key={p}>{p}</li>)}</ul>
              <div className="fit-nav">
                <button type="button" onClick={() => setOpen((open - 1 + FITS.length) % FITS.length)}>← prev</button>
                <button type="button" onClick={() => setOpen((open + 1) % FITS.length)}>next →</button>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </section>
  );
}
