import { useEffect, useRef, useState } from "react";
import { ROLES } from "../data";
import { prefersReducedMotion } from "../lib";

const FULL = "RORI OLANIYI";

/* the name types itself out, then the role underneath flips through the resume */
function TypedName() {
  const [t, setT] = useState(() => (prefersReducedMotion() ? FULL.length : 0));
  useEffect(() => {
    if (t >= FULL.length) return;
    const id = setTimeout(() => setT(t + 1), 130);
    return () => clearTimeout(id);
  }, [t]);
  const done = t >= FULL.length;
  return (
    <span aria-hidden="true">
      {FULL.slice(0, t)}
      {!done && <span className="caret-z"><span className="caret" /></span>}
      <span style={{ color: "transparent" }}>{FULL.slice(t)}</span>
      <span style={{ color: done ? "var(--ember)" : "transparent" }}>.</span>
    </span>
  );
}

function RoleFlip() {
  const el = useRef<HTMLSpanElement>(null);
  const [i, setI] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(() => {
      const node = el.current;
      if (!node) return;
      node.classList.add("out");
      setTimeout(() => {
        setI((n) => (n + 1) % ROLES.length);
        node.classList.remove("out");
        node.classList.add("pre");
        void node.offsetWidth; // restart from the flipped-under position
        node.classList.remove("pre");
      }, 320);
    }, 2600);
    return () => clearInterval(id);
  }, []);
  return <span className="flip" ref={el}>{ROLES[i]}</span>;
}

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero-copy">
        <div className="credit mono glow" aria-hidden="true">✦ a rori.dev production ✦</div>
        <div className="greeting glow">Hello 👋, I'm</div>
        <h1 className="name" aria-label="Rori Olaniyi"><TypedName /></h1>
        <p className="roles glow">
          <span className="as mono" aria-hidden="true">starring as</span>
          <span className="flip-wrap" aria-hidden="true"><span className="sep">✳</span> <RoleFlip /> <span className="sep">✳</span></span>
          <span className="sr-only">Software engineer, AI engineer, machine learning engineer, search and retrieval engineer, full-stack engineer.</span>
        </p>
        <a className="next-badge" href="#experience"><img src="/assets/logos/datadog.svg" alt="" /><span>coming winter 2027<span className="when-long"> · swe intern</span> <b>@ datadog</b></span></a>
        <div className="ctas">
          <a href="#projects" className="btn-main">View Projects</a>
          <a href="#contact" className="btn-alt">Say hello</a>
        </div>
      </div>
    </section>
  );
}
