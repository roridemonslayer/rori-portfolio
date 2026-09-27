import { useEffect, useRef } from "react";
import { SKILLS } from "../data";

/* my stack: a still grid of big bold logos over the painting.
   Shown only while the visitor has scrolled down to it; hides again on the way back up. */
export default function Stack() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const els = [...root.current!.querySelectorAll<HTMLElement>("[data-after-scroll]")];
    const check = () => {
      for (const el of els) el.classList.toggle("revealed", scrollY >= 60 && el.getBoundingClientRect().top < innerHeight * 0.88);
    };
    addEventListener("scroll", check, { passive: true });
    addEventListener("resize", check);
    return () => { removeEventListener("scroll", check); removeEventListener("resize", check); };
  }, []);
  return (
    <section className="stack-wrap" id="stack" aria-labelledby="stack-t" ref={root}>
      <div className="stack-title" data-after-scroll>
        <span className="mark" aria-hidden="true">✽</span>
        <h2 id="stack-t">MY STACK</h2>
      </div>
      <ul className="skills" data-after-scroll style={{ ["--reveal-delay" as string]: "0.14s" }}>
        {SKILLS.map((s) => (
          <li key={s.name}><img className={s.darkLogo ? "dark-logo" : undefined} src={`/assets/icons/${s.icon}`} alt="" />{s.name}</li>
        ))}
      </ul>
    </section>
  );
}
