import { useCallback, useEffect, useRef, useState } from "react";
import { LINKS, PROJECTS, type Project } from "../data";
import { prefersReducedMotion } from "../lib";

/* projects: a slideshow, one project per slide (art lives in public/projects/<slug>.jpg).
   Arrows, dots, ← → keys and swipe move between slides; it keeps advancing on its own, pausing while hovered.
   The last slide points to GitHub, and the show loops forward (last → first keeps sliding the same way). */
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

const HANDLE = LINKS.github.replace(/^https?:\/\/github\.com\//, "");

/* the closing slide: everything else lives on GitHub */
function MoreSlide() {
  return (
    <a className="work-frame more-slide" href={LINKS.github} target="_blank" rel="noopener">
      <span className="octo-walk" aria-hidden="true"><span className="octo-turn">
      <svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
      </span></span>
      <b>There's more in the workshop.</b>
      <span className="mono">github.com/{HANDLE} →</span>
    </a>
  );
}

type Slide = { key: string; title: string; kind: string; line: string; body: string; foot: string; link: string; linkText: string; art: React.ReactNode };
const SLIDES: Slide[] = [
  ...PROJECTS.map((p) => ({ key: p.slug, title: p.title, kind: p.kind, line: p.line, body: p.body, foot: p.tags.join(" · "), link: p.link, linkText: "github →", art: <Art p={p} /> })),
  {
    key: "more", title: "More on GitHub", kind: "everything else", line: "Experiments, class projects and open-source work.",
    body: "The slideshow has my favorites. The rest, from early games to data science notebooks to open-source contributions, lives on my GitHub.",
    foot: `@${HANDLE}`, link: LINKS.github, linkText: "see all projects →", art: <MoreSlide />,
  },
];
const N = SLIDES.length;
// the track holds a copy of the last slide before the first and a copy of the first after the last,
// so moving past either end keeps sliding the same way, then quietly jumps to the real slide
const TRACK = [SLIDES[N - 1], ...SLIDES, SLIDES[0]];

export default function Projects() {
  const [pos, setPos] = useState(1); // index into TRACK; real slides are 1..N
  const [anim, setAnim] = useState(true);
  const auto = !prefersReducedMotion();
  const [paused, setPaused] = useState(false); // only while the mouse is over it
  const [tick, setTick] = useState(0); // bumped on manual moves so the timer restarts
  const i = (((pos - 1) % N) + N) % N;
  const busy = pos < 1 || pos > N; // mid-way onto a copy; wait for it to settle
  const step = useCallback((d: number) => { setAnim(true); setPos((x) => (x < 1 || x > N ? x : x + d)); }, []);
  const jump = (k: number) => { setAnim(true); setPos(k + 1); };
  const stop = () => setTick((t) => t + 1);
  const touchX = useRef<number | null>(null);
  const root = useRef<HTMLDivElement>(null);

  // landed on a copy at either end: swap to the real slide without animating
  const onTrackEnd = (e: React.TransitionEvent) => {
    if (e.target !== e.currentTarget) return;
    if (pos > N) { setAnim(false); setPos(1); }
    else if (pos < 1) { setAnim(false); setPos(N); }
  };
  useEffect(() => {
    if (anim) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setAnim(true)));
    return () => cancelAnimationFrame(id);
  }, [anim]);

  // keeps advancing on its own while it's on screen; pauses only while hovered
  useEffect(() => {
    if (!auto || paused) return;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.4 });
    io.observe(root.current!);
    const id = setInterval(() => { if (visible && !document.hidden) step(1); }, AUTO_MS);
    return () => { clearInterval(id); io.disconnect(); };
  }, [auto, paused, step, tick]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { stop(); step(1); }
    else if (e.key === "ArrowLeft") { stop(); step(-1); }
  };

  const sl = SLIDES[i];
  const num = (k: number) => String(k + 1).padStart(2, "0");

  return (
    <section id="projects" className="workshop" aria-labelledby="proj-t">
      <div className="ws-head" data-reveal="0">
        <div className="xp-eyebrow"><span className="mark" aria-hidden="true">✦</span>THE WORKSHOP</div>
        <h2 id="proj-t">PROJECTS</h2>
        <p className="xp-intro">Things I've built. Flip through them.</p>
      </div>

      <div className="show" ref={root} data-reveal="1" role="region" aria-roledescription="carousel" aria-label="Projects" tabIndex={0} onKeyDown={onKey}
        onMouseEnter={() => setPaused(true)} onMouseLeave={() => { setPaused(false); setTick((t) => t + 1); }}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; stop(); }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}>
        <div className="show-main">
        <div className="show-stage">
          <div className="show-track" onTransitionEnd={onTrackEnd}
            style={{ transform: `translateX(-${pos * 100}%)`, transition: anim ? undefined : "none" }}>
            {TRACK.map((slide, k) => (
              <div className="show-slide" key={k} role="group" aria-roledescription="slide" aria-label={`${slide.title}`} aria-hidden={k !== pos}>
                {slide.art}
              </div>
            ))}
          </div>
          <button type="button" className="show-arrow prev" aria-label="Previous project" disabled={busy} onClick={() => { stop(); step(-1); }}>←</button>
          <button type="button" className="show-arrow next" aria-label="Next project" disabled={busy} onClick={() => { stop(); step(1); }}>→</button>
          {auto && <div className="show-timer" key={`${pos}-${tick}`} aria-hidden="true" style={{ animationDuration: `${AUTO_MS}ms`, animationPlayState: paused ? "paused" : "running" }} />}
        </div>

        <article className="work-label" aria-live="polite" key={sl.key}>
          <div className="work-meta mono"><span className="work-n">{num(i)}</span>{sl.kind}<span className="show-count">{num(i)} / {num(N - 1)}</span></div>
          <h3>{sl.title}</h3>
          <p className="work-line">{sl.line}</p>
          <p>{sl.body}</p>
          <div className="work-foot mono">
            <span>{sl.foot}</span>
            <a href={sl.link} target="_blank" rel="noopener">{sl.linkText}</a>
          </div>
        </article>
        </div>

        <div className="show-dots" role="tablist" aria-label="Choose a project">
          {SLIDES.map((slide, k) => (
            <button key={slide.key} type="button" role="tab" aria-selected={k === i} aria-label={slide.title} className={slide.key === "more" ? "more" : undefined} onClick={() => { stop(); jump(k); }}>
              <span>{slide.key === "more" ? "More on GitHub ↗" : slide.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
