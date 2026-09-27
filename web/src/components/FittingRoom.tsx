import { useEffect, useRef, useState } from "react";
import type * as ThreeNS from "three";

import { OUTFITS, createFigure, type Outfit } from "../figure";

/* fitting room: a 3D me, dressed in my fits (outfits live in src/figure.ts) */
type Controls = { dress: (o: Outfit) => void; setView: (v: number) => void; zoomBy: (d: number) => void; reset: () => void; setAuto: (on: boolean) => void };

function buildScene(T: typeof ThreeNS, RoomEnvironment: typeof import("three/examples/jsm/environments/RoomEnvironment.js").RoomEnvironment,
  RoundedBox: typeof import("three/examples/jsm/geometries/RoundedBoxGeometry.js").RoundedBoxGeometry,
  canvas: HTMLCanvasElement, stage: HTMLElement, onView: (v: number) => void, onAuto: (on: boolean) => void) {
  const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  const scene = new T.Scene();
  // studio reflections for the fabrics, skin and the puffer's sheen
  const pmrem = new T.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.45;
  const camera = new T.PerspectiveCamera(26, 1, 0.1, 50);
  const LOOK_Y = 0.98;
  let zoom = 1;

  const key = new T.DirectionalLight(0xfff1e0, 2.2);
  key.position.set(2, 4.2, 3.4);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = key.shadow.camera.bottom = -1.4;
  key.shadow.camera.right = key.shadow.camera.top = 1.4;
  key.shadow.radius = 6;
  key.shadow.bias = -0.0003;
  key.shadow.normalBias = 0.02;
  scene.add(key);
  const rim = new T.DirectionalLight(0xdbe6ff, 1.4);
  rim.position.set(-2.8, 3, -2.6);
  scene.add(rim);
  const fill = new T.DirectionalLight(0xffe7d4, 0.5);
  fill.position.set(-3, 1.2, 2.5);
  scene.add(fill);

  const floor = new T.Mesh(new T.CircleGeometry(1.4, 64), new T.ShadowMaterial({ opacity: 0.18 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const fig = createFigure(T, RoundedBox);
  scene.add(fig.root);
  const figure = fig.root; // the plinth turns with the figure, like a display turntable
  const dress = fig.dress;

  // ---- turning, views, zoom, auto rotate
  let rotY = 0, targetY = 0, vel = 0, dragging = false, lastX = 0, auto = true, lastView = -1;
  const setAuto = (on: boolean) => { auto = on; onAuto(on); };
  const onDown = (e: PointerEvent) => { dragging = true; lastX = e.clientX; canvas.setPointerCapture(e.pointerId); setAuto(false); };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    targetY += dx * 0.012;
    vel = dx * 0.012;
  };
  const endDrag = () => { dragging = false; };
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    setAuto(false);
    targetY += (e.key === "ArrowRight" ? 1 : -1) * (Math.PI / 8);
  };
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
  canvas.addEventListener("keydown", onKey);

  const resize = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(stage);
  resize();

  let visible = true;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  io.observe(stage);
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) setAuto(false);

  let last = performance.now(), raf = 0;
  const frame = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (visible) {
      if (auto) targetY += dt * 0.6;
      else if (!dragging && Math.abs(vel) > 0.0005) { targetY += vel; vel *= 0.92; }
      rotY += (targetY - rotY) * Math.min(1, dt * 10);
      figure.rotation.y = rotY;
      camera.position.set(0, LOOK_Y + 0.25 + (zoom - 1) * 0.4, 5.0 / zoom);
      camera.lookAt(0, LOOK_Y + (zoom - 1) * 0.45, 0);
      const n = ((Math.round(rotY / (Math.PI / 2)) % 4) + 4) % 4; // 0 front, 1 side, 2 back, 3 other side
      const v = n === 3 ? 1 : n;
      if (v !== lastView) { lastView = v; onView(v); }
      renderer.render(scene, camera);
    }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  const controls: Controls = {
    dress,
    setView(v) {
      setAuto(false);
      const want = v * (Math.PI / 2);
      targetY = want + Math.round((rotY - want) / (Math.PI * 2)) * Math.PI * 2;
    },
    zoomBy(d) { zoom = Math.min(1.8, Math.max(0.7, zoom + d)); },
    reset() { zoom = 1; targetY = Math.round(rotY / (Math.PI * 2)) * Math.PI * 2; setAuto(true); },
    setAuto,
  };
  const dispose = () => {
    cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
    canvas.removeEventListener("pointerdown", onDown); canvas.removeEventListener("pointermove", onMove);
    canvas.removeEventListener("pointerup", endDrag); canvas.removeEventListener("pointercancel", endDrag);
    canvas.removeEventListener("keydown", onKey);
    renderer.dispose();
  };
  return { controls, dispose, getAuto: () => auto };
}

export default function FittingRoom() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctl = useRef<Controls | null>(null);
  const [status, setStatus] = useState<"idle" | "ready" | "failed">("idle");
  const [fit, setFit] = useState(OUTFITS[0]);
  const [view, setView] = useState(0);
  const [auto, setAuto] = useState(true);

  // only fetch three.js when the fitting room is about to scroll into view
  useEffect(() => {
    let dispose: (() => void) | undefined, cancelled = false;
    const io = new IntersectionObserver(async ([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      try {
        const [T, { RoomEnvironment }, { RoundedBoxGeometry }] = await Promise.all([
          import("three"), import("three/examples/jsm/environments/RoomEnvironment.js"), import("three/examples/jsm/geometries/RoundedBoxGeometry.js"),
        ]);
        if (cancelled) return;
        const built = buildScene(T, RoomEnvironment, RoundedBoxGeometry, canvasRef.current!, stageRef.current!, setView, setAuto);
        dispose = built.dispose;
        ctl.current = built.controls;
        built.controls.dress(OUTFITS[0]);
        setStatus("ready");
      } catch (err) {
        console.error(err);
        setStatus("failed");
      }
    }, { rootMargin: "600px 0px" });
    io.observe(stageRef.current!);
    return () => { cancelled = true; io.disconnect(); dispose?.(); };
  }, []);

  const pick = (o: Outfit) => { setFit(o); ctl.current?.dress(o); };

  return (
    <section id="fits" className="section" aria-labelledby="fits-t">
      <div className="sec-head">
        <span className="num">04</span>
        <h2 id="fits-t">Fitting room</h2>
        <span className="aside">fashion is half the fun</span>
      </div>
      <div className="fitting">
        <div>
          <div className="stage" ref={stageRef}>
            <div className="stage-label mono"><span>RORI OLANIYI / PERSONAL EDITION</span><span>360° VIEW</span></div>
            {status !== "ready" && (
              <div className="stage-loading mono">{status === "failed" ? "3d view isn't supported in this browser" : "setting up the fitting room…"}</div>
            )}
            <canvas ref={canvasRef} tabIndex={0} aria-label="3D figure wearing the selected outfit. Drag, or use the left and right arrow keys, to turn it." />
          </div>
          <div className="stage-bar mono">
            <div className="views" role="group" aria-label="View">
              {["FRONT", "SIDE", "BACK"].map((label, v) => (
                <button key={label} type="button" aria-pressed={view === v} onClick={() => ctl.current?.setView(v)}>{label}</button>
              ))}
            </div>
            <span className="drag-hint">drag to spin · ← → when focused</span>
            <div className="zoom">
              <button type="button" aria-label="Zoom out" onClick={() => ctl.current?.zoomBy(-0.2)}>−</button>
              <button type="button" id="zoom-reset" onClick={() => ctl.current?.reset()}>RESET</button>
              <button type="button" aria-label="Zoom in" onClick={() => ctl.current?.zoomBy(0.2)}>+</button>
              <button type="button" className="autorot" aria-pressed={auto} onClick={() => ctl.current?.setAuto(!auto)}>auto rotate ↻</button>
            </div>
          </div>
        </div>
        <div className="fit-side">
          <p>Fashion is something I'm proud of. Pick a fit and spin me around.</p>
          <ul className="outfits">
            {OUTFITS.map((o) => (
              <li key={o.id}>
                <button type="button" className="outfit" aria-pressed={o === fit} onClick={() => pick(o)}>
                  <span className="swatches">{o.swatches.map((c, i) => <i key={i} style={{ background: c }} />)}</span>
                  <span>{o.name}<small>{o.note}</small></span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
