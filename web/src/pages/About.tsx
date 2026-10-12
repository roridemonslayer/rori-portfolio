import { INTERESTS, OVERVIEW, STORY } from "../about-data";
import LightStrip from "../components/LightStrip";
import { ARTICLES } from "../writing-data";

export default function About() {
  return (
    <main className="about-page">
      <a className="back-home mono" href="/">← back to the main page</a>

      <section className="about-intro sheet-lite" aria-labelledby="about-top">
        <div className="xp-eyebrow"><span className="mark" aria-hidden="true">✦</span>ABOUT ME</div>
        <h1 id="about-top">Hi, I'm Rori.</h1>
        {OVERVIEW.map((p) => <p key={p}>{p}</p>)}
      </section>

      <section className="about-block" aria-labelledby="story-t" data-reveal="0">
        <h2 id="story-t" className="about-h">my story</h2>
        <div className="story sheet-lite">
          {STORY.map((part) => (
            <div className="story-part" key={part.label}>
              <h3>{part.label}</h3>
              {part.paras.map((t) => <p key={t}>{t}</p>)}
            </div>
          ))}
        </div>
      </section>

      <section className="about-block" aria-labelledby="writing-t" data-reveal="0">
        <h2 id="writing-t" className="about-h">my writing</h2>
        <div className="writing-grid">
          {ARTICLES.map((a) => (
            <a className="writing-card sheet-lite" key={a.slug} href={`/writing/${a.slug}`}>
              <img src={`/writing/${a.slug}/og.jpg`} alt="" loading="lazy" />
              <div className="writing-card-body">
                <div className="mono writing-card-meta">{a.date} · {a.minutes} min read{a.status && <span className="wip"> · {a.status}</span>}</div>
                <h3>{a.title}</h3>
                <p>{a.summary}</p>
                <span className="mono writing-card-cta">read it →</span>
              </div>
            </a>
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
