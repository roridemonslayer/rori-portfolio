import { useState } from "react";
import { PROJECTS, type Project } from "../data";

/* projects: one framed picture per project (art lives in public/projects/<slug>.jpg) with a label card beside it */
function Art({ p, n }: { p: Project; n: string }) {
  const [missing, setMissing] = useState(false);
  return (
    <figure className="work-art">
      <div className="work-frame">
        {missing ? (
          <div className="work-titlecard" aria-hidden="true">
            <span className="mono">fig. {n}</span>
            <b>{p.title}</b>
            {import.meta.env.DEV && <small className="mono">add art: public/projects/{p.slug}.jpg</small>}
          </div>
        ) : (
          <img src={`/projects/${p.slug}.jpg`} alt={`Artwork for ${p.title}`} loading="lazy" onError={() => setMissing(true)} />
        )}
      </div>
      <figcaption className="mono">fig. {n} — {p.title.toLowerCase()}</figcaption>
    </figure>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="workshop" aria-labelledby="proj-t">
      <div className="ws-head" data-reveal="0">
        <div className="xp-eyebrow"><span className="mark" aria-hidden="true">✦</span>THE WORKSHOP</div>
        <h2 id="proj-t">PROJECTS</h2>
        <p className="xp-intro">Things I've built, one frame at a time.</p>
      </div>
      <ol className="works">
        {PROJECTS.map((p, i) => {
          const n = String(i + 1).padStart(2, "0");
          return (
            <li className="work" key={p.slug} data-reveal="1">
              <Art p={p} n={n} />
              <article className="work-label">
                <div className="work-meta mono"><span className="work-n">{n}</span>{p.kind}</div>
                <h3>{p.title}</h3>
                <p className="work-line">{p.line}</p>
                <p>{p.body}</p>
                <div className="work-foot mono">
                  <span>{p.tags.join(" · ")}</span>
                  <a href={p.link} target="_blank" rel="noopener">github →</a>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
