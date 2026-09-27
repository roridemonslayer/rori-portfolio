import { useEffect, useRef, useState } from "react";
import type * as ThreeNS from "three";

/* fitting room: a little 3d me, dressed in my fits.
   Add an outfit by adding an entry to OUTFITS; every colour is a hex value. */
type Outfit = {
  id: string; name: string; note: string;
  skin: string; hair: string;
  cap?: { plaid?: [string, string, string]; color?: string };
  top: string; collar: string; tie?: string;
  bottom: string; shoes: string; glasses?: boolean;
};
const OUTFITS: Outfit[] = [
  {
    id: "picture-day", name: "picture day", note: "plaid cap · navy knit · tie",
    skin: "#7b4a2d", hair: "#1c120c",
    cap: { plaid: ["#6b5e57", "#b9aea3", "#3a2f2b"] },
    top: "#1c2536", collar: "#f3f1ec", tie: "#9c8f7a",
    bottom: "#2a2a2e", shoes: "#141414", glasses: true,
  },
];

type Controls = { dress: (o: Outfit) => void; setView: (v: number) => void; zoomBy: (d: number) => void; reset: () => void; setAuto: (on: boolean) => void };

function buildScene(T: typeof ThreeNS, canvas: HTMLCanvasElement, stage: HTMLElement, onView: (v: number) => void, onAuto: (on: boolean) => void) {
  const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(30, 1, 0.1, 50);
  const LOOK_Y = 0.92;
  let zoom = 1;

  scene.add(new T.HemisphereLight(0xffffff, 0x8a8f80, 1.1));
  const key = new T.DirectionalLight(0xfff4e0, 1.6);
  key.position.set(2.2, 4, 3);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = key.shadow.camera.bottom = -1.5;
  key.shadow.camera.right = key.shadow.camera.top = 1.5;
  key.shadow.radius = 6;
  scene.add(key);
  const rim = new T.DirectionalLight(0xc8d8ff, 0.7);
  rim.position.set(-3, 2.5, -2.5);
  scene.add(rim);

  const floor = new T.Mesh(new T.CircleGeometry(0.75, 48), new T.ShadowMaterial({ opacity: 0.22 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  const plate = new T.Mesh(new T.CylinderGeometry(0.46, 0.48, 0.02, 64), new T.MeshStandardMaterial({ color: 0xf2efe6, roughness: 0.9 }));
  plate.position.y = 0.01;
  plate.receiveShadow = true;
  scene.add(plate);

  const figure = new T.Group();
  scene.add(figure);

  const mat = (c: string, rough = 0.75, extra: ThreeNS.MeshStandardMaterialParameters = {}) => new T.MeshStandardMaterial({ color: c, roughness: rough, ...extra });
  function plaidTexture([a, b, c]: [string, string, string]) {
    const cv = document.createElement("canvas");
    cv.width = cv.height = 64;
    const g = cv.getContext("2d")!;
    g.fillStyle = a; g.fillRect(0, 0, 64, 64);
    g.fillStyle = b; g.globalAlpha = 0.6;
    for (let i = 0; i < 64; i += 16) { g.fillRect(i, 0, 5, 64); g.fillRect(0, i, 64, 5); }
    g.fillStyle = c; g.globalAlpha = 0.7;
    for (let i = 8; i < 64; i += 16) { g.fillRect(i, 0, 2, 64); g.fillRect(0, i, 64, 2); }
    const t = new T.CanvasTexture(cv);
    t.wrapS = t.wrapT = T.RepeatWrapping;
    t.repeat.set(3, 3);
    return t;
  }
  function add(parent: ThreeNS.Object3D, geo: ThreeNS.BufferGeometry, material: ThreeNS.Material, x = 0, y = 0, z = 0, sx = 1, sy = 1, sz = 1) {
    const m = new T.Mesh(geo, material);
    m.position.set(x, y, z);
    m.scale.set(sx, sy, sz);
    m.castShadow = true;
    parent.add(m);
    return m;
  }
  // a limb segment between two points
  function limb(parent: ThreeNS.Object3D, material: ThreeNS.Material, a: [number, number, number], b: [number, number, number], r1: number, r2: number) {
    const A = new T.Vector3(...a), B = new T.Vector3(...b);
    const m = new T.Mesh(new T.CylinderGeometry(r2, r1, A.distanceTo(B), 20), material);
    m.position.copy(A).add(B).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), B.clone().sub(A).normalize());
    m.castShadow = true;
    parent.add(m);
    return m;
  }

  function dress(o: Outfit) {
    figure.clear();
    const skin = mat(o.skin, 0.55);
    const top = mat(o.top, 0.9);
    const bottom = mat(o.bottom, 0.85);
    const shoe = mat(o.shoes, 0.4);
    const sphere = new T.SphereGeometry(1, 32, 24);

    // legs + shoes
    for (const s of [-1, 1]) {
      const x = 0.085 * s;
      limb(figure, bottom, [x, 0.1, 0], [x, 0.5, 0], 0.062, 0.07);
      add(figure, sphere, bottom, x, 0.5, 0, 0.074, 0.06, 0.074);
      limb(figure, bottom, [x, 0.5, 0], [x * 1.05, 0.93, 0], 0.074, 0.088);
      add(figure, new T.BoxGeometry(0.1, 0.07, 0.25), shoe, x, 0.055, 0.035);
      add(figure, sphere, shoe, x, 0.06, 0.15, 0.05, 0.04, 0.05);
    }
    // hips + torso (the knit)
    add(figure, sphere, bottom, 0, 0.95, 0, 0.17, 0.1, 0.11);
    add(figure, new T.CapsuleGeometry(0.15, 0.3, 8, 24), top, 0, 1.2, 0, 1.18, 1, 0.72);
    // ribbed hem + zip line
    add(figure, new T.CylinderGeometry(0.176, 0.17, 0.05, 32), top, 0, 0.99, 0, 1, 1, 0.62);
    add(figure, new T.BoxGeometry(0.008, 0.2, 0.01), mat("#b8b8b8", 0.3, { metalness: 0.6 }), 0, 1.36, 0.108);
    // shirt collar + tie peeking out
    add(figure, new T.CylinderGeometry(0.06, 0.075, 0.07, 24), mat(o.collar, 0.8), 0, 1.49, 0.005);
    if (o.tie) add(figure, new T.BoxGeometry(0.035, 0.13, 0.012), mat(o.tie, 0.6), 0, 1.4, 0.104);
    // arms
    for (const s of [-1, 1]) {
      add(figure, sphere, top, 0.2 * s, 1.43, 0, 0.075, 0.075, 0.075);
      limb(figure, top, [0.215 * s, 1.43, 0], [0.245 * s, 1.14, 0.01], 0.064, 0.058);
      add(figure, sphere, top, 0.245 * s, 1.14, 0.01, 0.056, 0.056, 0.056);
      limb(figure, top, [0.245 * s, 1.14, 0.01], [0.26 * s, 0.9, 0.04], 0.056, 0.048);
      add(figure, sphere, skin, 0.262 * s, 0.84, 0.045, 0.036, 0.06, 0.025);
    }
    // neck + head
    limb(figure, skin, [0, 1.47, 0], [0, 1.56, 0.005], 0.045, 0.042);
    const head = new T.Group();
    head.position.set(0, 1.66, 0.01);
    figure.add(head);
    add(head, sphere, skin, 0, 0, 0, 0.092, 0.115, 0.1);
    add(head, sphere, skin, 0.093, -0.005, 0, 0.015, 0.025, 0.012);
    add(head, sphere, skin, -0.093, -0.005, 0, 0.015, 0.025, 0.012);
    // locs: hanging from under the cap, framing the face and down the back
    const hair = mat(o.hair, 0.9);
    for (let i = 0; i < 22; i++) {
      const a = Math.PI * 0.18 + (i / 21) * Math.PI * 1.64; // skip the face
      const x = Math.sin(a) * 0.092, z = Math.cos(a) * 0.092;
      const len = 0.2 + (i % 3) * 0.035;
      limb(head, hair, [x, 0.03, z], [x * 1.25, 0.03 - len, z * 1.25 - 0.015], 0.012, 0.01);
    }
    if (o.glasses) {
      const frame = mat("#0d0d0d", 0.3);
      for (const s of [-1, 1]) {
        add(head, new T.TorusGeometry(0.026, 0.006, 8, 24), frame, 0.035 * s, 0.005, 0.098, 1.15, 0.85, 1);
        limb(head, frame, [0.064 * s, 0.01, 0.095], [0.094 * s, 0.01, 0.01], 0.004, 0.004);
      }
      limb(head, frame, [-0.012, 0.01, 0.1], [0.012, 0.01, 0.1], 0.004, 0.004);
    }
    // newsboy cap
    if (o.cap) {
      const capMat = o.cap.plaid ? mat("#ffffff", 0.95, { map: plaidTexture(o.cap.plaid) }) : mat(o.cap.color ?? "#555", 0.9);
      add(head, sphere, capMat, 0, 0.06, -0.005, 0.112, 0.07, 0.122);
      add(head, new T.CylinderGeometry(0.1, 0.1, 0.012, 32, 1, false, -Math.PI / 2.4, Math.PI / 1.2), capMat, 0, 0.035, 0.035, 1, 1, 1.25);
      add(head, sphere, capMat, 0, 0.13, 0, 0.012, 0.008, 0.012);
    }
  }

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
      camera.position.set(0, LOOK_Y + 0.15 + (zoom - 1) * 0.35, 4.1 / zoom);
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
        const T = await import("three");
        if (cancelled) return;
        const built = buildScene(T, canvasRef.current!, stageRef.current!, setView, setAuto);
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
                  <span className="swatches">{[o.cap?.plaid?.[0], o.top, o.tie, o.bottom].filter(Boolean).map((c, i) => <i key={i} style={{ background: c }} />)}</span>
                  <span>{o.name}<small>{o.note}</small></span>
                </button>
              </li>
            ))}
            <li><div className="outfit soon"><span>next fit coming soon ✦</span></div></li>
          </ul>
        </div>
      </div>
    </section>
  );
}
