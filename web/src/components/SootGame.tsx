import { useEffect, useRef, useState } from "react";
import { createSootClimb } from "../game";

const KEYMAP: Record<string, "left" | "right" | "jump"> = { ArrowLeft: "left", a: "left", A: "left", ArrowRight: "right", d: "right", D: "right", " ": "jump", ArrowUp: "jump", w: "jump", W: "jump" };

/* soot climb mini game, in a dialog */
export default function SootGame({ open, onClose }: { open: boolean; onClose: () => void }) {
  const cv = useRef<HTMLCanvasElement>(null);
  const game = useRef<ReturnType<typeof createSootClimb> | null>(null);
  const [score, setScore] = useState("0m · best 0m");

  useEffect(() => {
    if (!open) return;
    const g = (game.current ??= createSootClimb(cv.current!, setScore));
    document.documentElement.style.overflow = "hidden";
    g.start();
    cv.current!.focus();
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      const k = KEYMAP[e.key];
      if (!k) return;
      e.preventDefault();
      if (k === "jump") { if (!e.repeat) g.pressJump(); } else g.keys[k] = true;
    };
    const up = (e: KeyboardEvent) => { const k = KEYMAP[e.key]; if (k) g.keys[k] = false; };
    const resize = () => g.resize();
    addEventListener("keydown", down); addEventListener("keyup", up); addEventListener("resize", resize);
    return () => {
      g.stop();
      document.documentElement.style.overflow = "";
      removeEventListener("keydown", down); removeEventListener("keyup", up); removeEventListener("resize", resize);
    };
  }, [open, onClose]);

  const pad = (k: "left" | "right" | "jump") => ({
    onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      if (k === "jump") game.current?.pressJump(); else if (game.current) game.current.keys[k] = true;
    },
    onPointerUp: () => { if (game.current) game.current.keys[k] = false; },
    onPointerCancel: () => { if (game.current) game.current.keys[k] = false; },
  });

  return (
    <div className="game" id="game" role="dialog" aria-modal="true" aria-label="Soot climb game" hidden={!open} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="game-box">
        <div className="game-bar">
          <b>soot climb 🍬</b>
          <span className="score mono">{score}</span>
          <button type="button" aria-label="Close game" onClick={onClose}>×</button>
        </div>
        <canvas ref={cv} tabIndex={0} aria-label="Game. Use arrow keys to move and space to jump."
          onPointerDown={() => game.current?.tapCanvas()} onPointerUp={() => { if (game.current) game.current.keys.jump = false; }} />
        <div className="game-pad">
          <button type="button" aria-label="Move left" {...pad("left")}>◀</button>
          <button type="button" className="jump" aria-label="Jump" {...pad("jump")}>jump</button>
          <button type="button" aria-label="Move right" {...pad("right")}>▶</button>
        </div>
        <div className="game-help">← → or A D to move · space / ↑ to jump</div>
      </div>
    </div>
  );
}
