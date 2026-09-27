import { INTERESTS, OVERVIEW, STORY } from "../about-data";
import LightStrip from "../components/LightStrip";
import PhotoCard from "../components/PhotoCard";

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
              {part.photos && (
                <div className="story-photos">
                  {part.photos.map((ph, k) => (
                    <figure className={"polaroid-card" + (ph.tall ? " tall" : "")} key={ph.src} style={{ rotate: `${[-3, 2.5, -1.5][k % 3]}deg` }}>
                      <PhotoCard src={ph.src} srcNight={ph.srcNight} focus={ph.src.includes("ghibli-day") ? "50% 80%" : undefined} label={ph.caption} alt={ph.caption} />
                      <figcaption>{ph.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              )}
            </div>
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
