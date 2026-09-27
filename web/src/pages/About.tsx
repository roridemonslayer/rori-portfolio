import { BEYOND, DONE, INTERESTS, OVERVIEW } from "../about-data";
import LightStrip from "../components/LightStrip";
import { PROJECTS } from "../data";

export default function About() {
  return (
    <main className="about-page">
      <a className="back-home mono" href="/">← back to the main page</a>

      <section className="about-intro sheet-lite" aria-labelledby="about-top">
        <div className="xp-eyebrow"><span className="mark" aria-hidden="true">✦</span>ABOUT ME</div>
        <h1 id="about-top">Hi, I'm Rori.</h1>
        {OVERVIEW.map((p) => <p key={p}>{p}</p>)}
      </section>

      <section className="about-block" aria-labelledby="done-t" data-reveal="0">
        <h2 id="done-t" className="about-h">What I've done</h2>
        <ol className="done sheet-lite">
          {DONE.map((d) => (
            <li key={d.company}>
              <span className="done-when mono">{d.when}</span>
              <img className="done-logo" src={`/assets/logos/${d.logo}`} alt="" />
              <div>
                <b>{d.role}</b> <span className="done-co">· {d.company}</span>
                <p>{d.line}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="about-block" aria-labelledby="built-t" data-reveal="0">
        <h2 id="built-t" className="about-h">What I've built</h2>
        <ul className="built">
          {PROJECTS.map((p) => (
            <li key={p.slug}>
              <a href={p.link} target="_blank" rel="noopener" className="sheet-lite">
                <span className="built-kind mono">{p.kind}</span>
                <b>{p.title}</b>
                <span className="built-line">{p.line}</span>
              </a>
            </li>
          ))}
        </ul>
        <a className="about-link mono" href="/#projects">see them with screenshots on the main page →</a>
      </section>

      <section className="about-block" aria-labelledby="beyond-t" data-reveal="0">
        <h2 id="beyond-t" className="about-h">Beyond the code</h2>
        <div className="beyond">
          {BEYOND.map((b) => (
            <div className="sheet-lite" key={b.title}><b>{b.title}</b><p>{b.line}</p></div>
          ))}
        </div>
      </section>

      <section className="about-block" aria-labelledby="into-t" data-reveal="0">
        <h2 id="into-t" className="about-h">Things I'm into</h2>
        <LightStrip items={INTERESTS} />
      </section>
    </main>
  );
}
