import { FITS, INTERESTS, OVERVIEW, PEOPLE } from "../about-data";
import LightStrip from "../components/LightStrip";
import PhotoCard from "../components/PhotoCard";

const TILTS = [-4, 3, -2, 5, -3, 2];

export default function About() {
  return (
    <main className="about-page">
      <a className="back-home mono" href="/">← back to the main page</a>

      <section className="about-intro sheet-lite" aria-labelledby="about-top">
        <div className="xp-eyebrow"><span className="mark" aria-hidden="true">✦</span>ABOUT ME</div>
        <h1 id="about-top">Hi, I'm Rori.</h1>
        {OVERVIEW.map((p) => <p key={p}>{p}</p>)}
      </section>

      <section className="about-block" aria-labelledby="fits-t" data-reveal="0">
        <h2 id="fits-t" className="about-h">My fits</h2>
        <div className="fits about-fits">
          {FITS.map((f, k) => (
            <figure className="polaroid-card" key={f} style={{ rotate: `${TILTS[k]}deg` }}>
              <PhotoCard src={`/assets/${f}`} label={`fit ${k + 1}`} alt={`Outfit ${k + 1}`} />
            </figure>
          ))}
        </div>
      </section>

      <section className="about-block" aria-labelledby="into-t" data-reveal="0">
        <h2 id="into-t" className="about-h">Things I'm into</h2>
        <LightStrip items={INTERESTS} />
      </section>

      <section className="about-block" aria-labelledby="people-t" data-reveal="0">
        <h2 id="people-t" className="about-h">My people</h2>
        <p className="about-sub">The people I care about most.</p>
        <ul className="collage">
          {PEOPLE.map((p, k) => (
            <li key={p.key} style={{ rotate: `${TILTS[k % TILTS.length]}deg` }}>
              <span className="tape" aria-hidden="true" />
              <figure className="polaroid-card">
                <PhotoCard src={p.photo} label={p.name || p.who} alt={p.name ? `${p.name}, ${p.who}` : p.who} />
                <figcaption><b>{p.name}</b>{p.name && " · "}{p.who}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
