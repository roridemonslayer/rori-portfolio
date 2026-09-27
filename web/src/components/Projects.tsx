import { useCallback, useEffect, useRef, useState } from "react";
import { PROJECTS, type Project } from "../data";
import { prefersReducedMotion } from "../lib";

/* projects: a slideshow, one project per slide (art lives in public/projects/<slug>.jpg).
   Arrows, dots, ← → keys and swipe move between slides; it advances on its own until you interact. */
function Art({ p }: { p: Project }) {
  const [missing, setMissing] = useState(false);
  return (
    <div className="work-frame">
      {missing ? (
        <div className="work-titlecard" aria-hidden="true"><b>{p.title}</b></div>
      ) : (
        <img src={`/projects/${p.slug}.jpg`} alt={`Screenshot of ${p.title}`} onError={() => setMissing(true)} />
      )}
    </div>
  );
}

const AUTO_MS = 7000;

export default function Projects() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(() => !prefersReducedMotion());
  const n = PROJECTS.length;
  const go = useCallback((to: number) => setI(((to % n) + n) % n), [n]);
  const stop = () => setAuto(false);
  const touchX = useRef<number | null>(null);
  const root = useRef<HTMLDivElement>(null);

  // advance on its own while it's on screen, until the visitor takes over
  useEffect(() => {
    if (!auto) return;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.4 });
    io.observe(root.current!);
    const id = setInterval(() => { if (visible && !document.hidden) setI((x) => (x + 1) % n); }, AUTO_MS);
    return () => { clearInterval(id); io.disconnect(); };
  }, [auto, n]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { stop(); go(i + 1); }
    else if (e.key === "ArrowLeft") { stop(); go(i - 1); }
  };

  const p = PROJECTS[i];
  const num = (k: number) => String(k + 1).padStart(2, "0");

  return (
    <section id="projects" className="workshop" aria-labelledby="proj-t">
      <div className="ws-head" data-reveal="0">
        <div className="xp-eyebrow"><span className="mark" aria-hidden="true">✦</span>THE WORKSHOP</div>
        <h2 id="proj-t">PROJECTS</h2>
        <p className="xp-intro">Things I've built. Flip through them.</p>
      </div>

      <div className="show" ref={root} data-reveal="1" role="region" aria-roledescription="carousel" aria-label="Projects" tabIndex={0} onKeyDown={onKey}
        onMouseEnter={stop} onFocus={stop}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; stop(); }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
          touchX.current = null;
        }}>
        <div className="show-stage">
          <div className="show-track" style={{ transform: `translateX(-${i * 100}%)` }}>
            {PROJECTS.map((proj, k) => (
              <div className="show-slide" key={proj.slug} role="group" aria-roledescription="slide" aria-label={`${k + 1} of ${n}: ${proj.title}`} aria-hidden={k !== i}>
                <Art p={proj} />
              </div>
            ))}
          </div>
          <button type="button" className="show-arrow prev" aria-label="Previous project" onClick={() => { stop(); go(i - 1); }}>←</button>
          <button type="button" className="show-arrow next" aria-label="Next project" onClick={() => { stop(); go(i + 1); }}>→</button>
          {auto && <div className="show-timer" key={i} aria-hidden="true" style={{ animationDuration: `${AUTO_MS}ms` }} />}
        </div>

        <article className="work-label" aria-live="polite" key={p.slug}>
          <div className="work-meta mono"><span className="work-n">{num(i)}</span>{p.kind}<span className="show-count">{num(i)} / {num(n - 1)}</span></div>
          <h3>{p.title}</h3>
          <p className="work-line">{p.line}</p>
          <p>{p.body}</p>
          <div className="work-foot mono">
            <span>{p.tags.join(" · ")}</span>
            <a href={p.link} target="_blank" rel="noopener">github →</a>
          </div>
        </article>

        <div className="show-dots" role="tablist" aria-label="Choose a project">
          {PROJECTS.map((proj, k) => (
            <button key={proj.slug} type="button" role="tab" aria-selected={k === i} aria-label={proj.title} onClick={() => { stop(); go(k); }}>
              <span>{proj.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
