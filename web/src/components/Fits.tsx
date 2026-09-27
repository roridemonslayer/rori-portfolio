import { useRef } from "react";

/* my fits: the real photos, as a row of polaroids you can scroll sideways (files in public/fits/) */
const FITS = [
  { file: "puffer", caption: "puffer season" },
  { file: "fur-collar", caption: "fur collar" },
  { file: "blue-zip", caption: "blue zip-up in the snow" },
  { file: "pink-scarf", caption: "pink scarf" },
  { file: "plaid-cap", caption: "plaid + cap" },
  { file: "newsboy", caption: "newsboy" },
  { file: "orange-beanie", caption: "orange beanie" },
];
const TILTS = [-2, 1.5, -1, 2, -1.5, 1, -2.5];

export default function Fits() {
  const row = useRef<HTMLUListElement>(null);
  // one big glide per click: a whole screenful of fits (minus a sliver so you keep your place)
  const slide = (dir: number) => {
    const r = row.current;
    if (r) r.scrollBy({ left: dir * Math.max(276, r.clientWidth - 120), behavior: "smooth" });
  };
  return (
    <section id="fits" className="section" aria-labelledby="fits-t">
      <div className="sec-head">
        <span className="num">04</span>
        <h2 id="fits-t">My fits</h2>
        <span className="aside">fashion is half the fun</span>
      </div>
      <div className="fit-wrap">
        <button type="button" className="fit-arrow prev" aria-label="Previous fits" onClick={() => slide(-1)}>←</button>
        <button type="button" className="fit-arrow next" aria-label="More fits" onClick={() => slide(1)}>→</button>
      <ul className="fit-row" ref={row}>
        {FITS.map((f, k) => (
          <li key={f.file} style={{ rotate: `${TILTS[k % TILTS.length]}deg` }}>
            <figure className="polaroid-card">
              <div className="fit-photo"><img src={`/fits/${f.file}.jpg`} alt={`Outfit: ${f.caption}`} loading="lazy" /></div>
              <figcaption>{f.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
      </div>
    </section>
  );
}
