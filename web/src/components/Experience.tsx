import { useEffect, useRef } from "react";
import { EXTRAS, JOBS } from "../data";
import { prefersReducedMotion } from "../lib";

/* experience: a scroll-drawn timeline the soot sprite rides down.
   Cards appear a little ahead of the sprite (and tuck away when you scroll back up),
   and each line lights up as the sprite passes it. */
export default function Experience() {
  const tlRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const tl = tlRef.current!;
    const fill = tl.querySelector<HTMLElement>(".tl-fill")!;
    const soot = tl.querySelector<HTMLElement>(".tl-soot")!;
    const items = [...tl.querySelectorAll<HTMLElement>(".tl-item")];
    const nodes = items.map((it) => it.querySelector<HTMLElement>(".node")!);
    const lines = [...tl.querySelectorAll<HTMLElement>(".tl-card header, .tl-card li, .tl-tags")];
    const reduce = prefersReducedMotion();
    // the path eases toward where the scroll says it should be, every frame, so trackpad/wheel steps don't show as jumps
    let shown = -1, raf = 0;
    const frame = () => {
      const r = tl.getBoundingClientRect();
      const target = Math.min(1, Math.max(0, (innerHeight * 0.55 - r.top) / r.height));
      shown = shown < 0 || reduce ? target : shown + (target - shown) * 0.3;
      if (Math.abs(target - shown) < 0.0004) shown = target;
      fill.style.transform = `scaleY(${shown})`;
      soot.style.transform = `translate3d(0, ${shown * r.height}px, 0)`;
      const tip = r.top + shown * r.height;
      nodes.forEach((n, k) => items[k].classList.toggle("passed", n.getBoundingClientRect().top <= tip + 1));
      for (const el of lines) el.classList.toggle("lit", el.getBoundingClientRect().top + 8 <= tip);
      for (const it of items) it.classList.toggle("shown", it.getBoundingClientRect().top < innerHeight * 0.85);
      raf = shown === target ? 0 : requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
    addEventListener("scroll", kick, { passive: true });
    addEventListener("resize", kick);
    kick();
    return () => { cancelAnimationFrame(raf); removeEventListener("scroll", kick); removeEventListener("resize", kick); };
  }, []);

  return (
    <section id="experience" className="section xp-sec" aria-labelledby="xp-t">
      <div className="xp-head" data-reveal="0">
        <div>
          <div className="xp-eyebrow"><span className="mark" aria-hidden="true">✦</span>MY JOURNEY</div>
          <h2 id="xp-t">WORK<br />EXPERIENCE</h2>
        </div>
        <p className="xp-intro">Every place I've been apprenticing so far, and what I built while I was there. Follow the soot sprite down the path.</p>
      </div>
      <div className="tl" ref={tlRef}>
        <div className="tl-fill" aria-hidden="true" />
        <div className="tl-soot" aria-hidden="true"><img src="/assets/soot-loader.png" alt="" /></div>
        <ol className="tl-list">
          {JOBS.map((j) => (
            <li className={"tl-item" + (j.next ? " next" : "")} key={j.company}>
              <div className="tl-when">
                <span className="node" aria-hidden="true" /><span className="date">{j.when}</span>
                {j.next && <span className="badge">incoming</span>}
              </div>
              <article className="tl-card">
                <header>
                  <img className="logo" src={`/assets/logos/${j.logo}`} alt="" style={j.logoPad ? { padding: 1 } : undefined} />
                  <div><h3>{j.role}</h3><div className="co">{j.company}</div></div>
                </header>
                <ul>{j.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
                {j.tags.length > 0 && <div className="tl-tags mono">{j.tags.map((t) => <span key={t}>{t}</span>)}</div>}
              </article>
            </li>
          ))}
        </ol>
      </div>
      <div className="extras mono">{EXTRAS.map((e) => <span key={e}>{e}</span>)}</div>
    </section>
  );
}
