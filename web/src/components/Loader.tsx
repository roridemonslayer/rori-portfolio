import { useEffect, useState } from "react";

/* loading screen: soot sprite hopping on a sunny field; hides once everything's loaded (min ~1.2s so the hop reads) */
export default function Loader() {
  const [state, setState] = useState<"showing" | "leaving" | "gone">("showing");

  useEffect(() => {
    document.body.classList.add("loading");
    const shownAt = performance.now();
    let timer = 0;
    const hide = () => {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        setState((s) => (s === "showing" ? "leaving" : s));
        document.body.classList.remove("loading");
      }, Math.max(0, 1200 - (performance.now() - shownAt)));
    };
    if (document.readyState === "complete") hide(); else addEventListener("load", hide, { once: true });
    const failsafe = window.setTimeout(hide, 6000); // never trap people behind the loader on a slow gif
    return () => { clearTimeout(timer); clearTimeout(failsafe); removeEventListener("load", hide); };
  }, []);

  if (state === "gone") return null;
  return (
    <div className={"loader" + (state === "leaving" ? " done" : "")} role="status" aria-label="Loading"
      onTransitionEnd={() => state === "leaving" && setState("gone")}>
      <div className="loader-inner">
        <div className="hop" aria-hidden="true">
          <span className="candy c1">✦</span><span className="candy c2">✦</span><span className="candy c3">✦</span>
          <div className="shadow" />
          <div className="soot"><img src="/assets/soot-loader.png" alt="" /></div>
        </div>
        <div className="loader-text mono">loading<span>.</span><span>.</span><span>.</span></div>
      </div>
    </div>
  );
}
