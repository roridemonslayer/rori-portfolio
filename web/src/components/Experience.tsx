import { useEffect, useRef } from "react";
import { EXTRAS, JOBS } from "../data";

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

    // positions inside the timeline don't change while scrolling, so measure them once (and on resize)
    // and each scroll only reads the timeline's own position: no easing, no layout thrash, locked to the scroll
    let height = 0, nodeY: number[] = [], lineY: number[] = [], itemY: number[] = [];
    const measure = () => {
      const t = tl.getBoundingClientRect().top;
      height = tl.offsetHeight;
      // cards/lines are shifted by their reveal animation, so measure from their un-shifted layout box
      const y = (el: HTMLElement) => el.getBoundingClientRect().top - t - (parseFloat(getComputedStyle(el.closest(".tl-card, .date") ?? el).translate.split(" ")[1] || "0") || 0);
      nodeY = nodes.map((n) => n.getBoundingClientRect().top - t);
      lineY = lines.map(y);
      itemY = items.map((it) => it.getBoundingClientRect().top - t);
    };
    const update = () => {
      const top = tl.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, (innerHeight * 0.55 - top) / height));
      const tip = p * height;
      fill.style.transform = `scaleY(${p})`;
      soot.style.transform = `translate3d(0, ${tip}px, 0)`;
      nodes.forEach((_, k) => items[k].classList.toggle("passed", nodeY[k] <= tip + 1));
      lines.forEach((el, k) => el.classList.toggle("lit", lineY[k] + 8 <= tip));
      items.forEach((it, k) => it.classList.toggle("shown", top + itemY[k] < innerHeight * 0.85));
    };
    const onResize = () => { measure(); update(); };
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(tl);
    onResize();
    return () => { removeEventListener("scroll", update); removeEventListener("resize", onResize); ro.disconnect(); };
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
