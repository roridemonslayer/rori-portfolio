import { useEffect, useRef, useState } from "react";

/* background music. Browsers only allow sound after the visitor interacts, so we try right away
   and otherwise start on the first click, tap or key press anywhere. The button mutes/unmutes. */
export default function Music() {
  const audio = useRef<HTMLAudioElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const muted = useRef(false); // every visit starts with music on; a mute only lasts until the page is left
  const fade = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [missing, setMissing] = useState(false);

  const fadeTo = (target: number) => {
    const a = audio.current!;
    clearInterval(fade.current);
    fade.current = window.setInterval(() => {
      a.volume = Math.min(1, Math.max(0, a.volume + (target > a.volume ? 0.03 : -0.05)));
      if ((target > 0 && a.volume >= target) || (target === 0 && a.volume <= 0)) {
        a.volume = target;
        clearInterval(fade.current);
        if (target === 0) a.pause();
      }
    }, 60);
  };
  const start = async () => {
    const a = audio.current!;
    if (muted.current) return;
    try { await a.play(); fadeTo(0.45); } catch { /* autoplay blocked until the first interaction */ }
  };

  useEffect(() => {
    const a = audio.current!;
    a.volume = 0;
    const sync = () => setPlaying(!a.paused && !muted.current);
    const onError = () => setMissing(true);
    // NETWORK_NO_SOURCE is briefly set while the src is still being picked up, so only trust a real error
    const onCanPlay = () => { setMissing(false); if (a.paused) start(); };
    a.addEventListener("play", sync); a.addEventListener("pause", sync);
    a.addEventListener("error", onError); a.addEventListener("canplay", onCanPlay);
    const firstTouch = (e: Event) => {
      if (btn.current?.contains(e.target as Node)) return; // the button handles its own click
      if (!a.paused) return EVENTS.forEach((t) => removeEventListener(t, firstTouch, true));
      start();
    };
    const EVENTS = ["pointerdown", "keydown", "touchstart"];
    EVENTS.forEach((t) => addEventListener(t, firstTouch, true));
    start();
    return () => {
      EVENTS.forEach((t) => removeEventListener(t, firstTouch, true));
      a.removeEventListener("play", sync); a.removeEventListener("pause", sync);
      a.removeEventListener("error", onError); a.removeEventListener("canplay", onCanPlay);
      clearInterval(fade.current);
    };
  }, []);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const a = audio.current!;
    // if nothing is audible yet (autoplay blocked), a click should start it, not mute it
    muted.current = !a.paused && !muted.current;
    if (muted.current) fadeTo(0); else start();
    setPlaying(!a.paused && !muted.current);
  };

  const on = playing && !missing;
  return (
    <>
      <audio ref={audio} src="/assets/lamore-dice-ciao.mp3" loop preload="auto" />
      <button ref={btn} className={"sound" + (on ? " playing" : " muted")} type="button" aria-pressed={!on} aria-label={on ? "Mute music" : "Play music"} onClick={toggle}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" fill="currentColor" fillOpacity="0.12" />
          <g className="waves"><path d="M15.5 9.2a4 4 0 0 1 0 5.6" /><path d="M18.3 6.6a7.6 7.6 0 0 1 0 10.8" /></g>
          <g className="x"><path d="M16 9.5l5 5M21 9.5l-5 5" /></g>
        </svg>
        <span className="sound-tip">{missing ? "no song file yet" : on ? "♪ l'amore dice ciao" : "tap for l'amore dice ciao"}</span>
      </button>
    </>
  );
}
