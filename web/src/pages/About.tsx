import { INTERESTS, OVERVIEW } from "../about-data";
import LightStrip from "../components/LightStrip";

export default function About() {
  return (
    <main className="about-page">
      <a className="back-home mono" href="/">← back to the main page</a>

      <section className="about-intro sheet-lite" aria-labelledby="about-top">
        <div className="xp-eyebrow"><span className="mark" aria-hidden="true">✦</span>ABOUT ME</div>
        <h1 id="about-top">Hi, I'm Rori.</h1>
        {OVERVIEW.map((p) => <p key={p}>{p}</p>)}
      </section>

      <section className="about-block" aria-labelledby="into-t" data-reveal="0">
        <h2 id="into-t" className="about-h">Things I'm into</h2>
        <LightStrip items={INTERESTS} />
      </section>
    </main>
  );
}
