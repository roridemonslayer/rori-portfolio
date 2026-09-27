import { store } from "./lib";

/* soot climb: jump up the platforms, don't fall.
   Every "step" is solid (stone or a slow cloud), spaced so it's always reachable from the one below.
   Crumbly platforms are extra shortcuts, never the only way up. */
type Kind = "ground" | "stone" | "moving" | "crumble";
type Plat = { x: number; y: number; oy: number; w: number; kind: Kind; vx: number; candy: boolean; crumbleAt: number; fall: number };
type Player = { x: number; y: number; w: number; h: number; vx: number; vy: number; ground: boolean; coyote: number; buffer: number; face: number; squash: number; ride: Plat | null };
type Spark = { x: number; y: number; vx: number; vy: number; life: number };
type State = {
  state: "ready" | "play" | "over"; t: number; camY: number; startY: number; top: number; plats: Plat[]; lastStep: Plat;
  sparks: Spark[]; banner: { text: string; until: number } | null; next: number; candies: number; newBest?: boolean; p: Player;
};

const GRAV = 0.5, JUMP_V = -11.8, RUN = 4.9, PX = 40; // PX = pixels per metre of height
const MAX_GAP = 104, MAX_REACH = 125;
const MILESTONES: [number, string][] = [[10, "above the meadow"], [25, "past the treetops"], [50, "level with the castle"], [100, "somewhere above the waste ✦"], [200, "calcifer is impressed 🔥"]];

export function createSootClimb(cv: HTMLCanvasElement, onScore: (text: string) => void) {
  const ctx = cv.getContext("2d")!;
  const keys = { left: false, right: false, jump: false };
  let best = Number(store.get("rori-climb-best")) || 0;
  let W = 0, H = 0, raf = 0, last = 0;
  let G!: State;

  function sizeCanvas() {
    const r = cv.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function platform(x: number, y: number, w: number, kind: Kind, height: number): Plat {
    const hard = Math.min(height / 120, 1);
    return {
      x, y, oy: y, w, kind,
      vx: kind === "moving" ? (Math.random() < 0.5 ? -1 : 1) * (0.6 + hard * 0.9) : 0,
      candy: kind !== "crumble" && Math.random() < 0.28, crumbleAt: 0, fall: 0,
    };
  }
  function addStep(prev: Plat) {
    const height = (G.startY - prev.y) / PX, hard = Math.min(height / 120, 1);
    const y = prev.y - (72 + Math.random() * (MAX_GAP - 72) * (0.6 + 0.4 * hard));
    const w = 104 - hard * 30 + Math.random() * 26;
    const kind: Kind = height > 6 && Math.random() < 0.15 + hard * 0.2 ? "moving" : "stone";
    // stay within jumping distance of the step below (moving clouds sweep the whole width anyway)
    const from = prev.kind === "ground" ? W / 2 : prev.x + prev.w / 2;
    // pick uniformly inside the reachable window (clamping would pile platforms up on the edges)
    const lo = Math.max(w / 2, from - MAX_REACH), hi = Math.min(W - w / 2, from + MAX_REACH);
    const cx = lo + Math.random() * Math.max(0, hi - lo);
    const step = platform(cx - w / 2, y, w, kind, height);
    G.plats.push(step);
    if (height > 4 && Math.random() < 0.3 + hard * 0.2) { // bonus crumbly ledge between steps
      const cw = 60 + Math.random() * 30;
      G.plats.push(platform(Math.random() * (W - cw), (prev.y + y) / 2, cw, "crumble", height));
    }
    G.top = y;
    G.lastStep = step;
  }
  function reset() {
    const ground: Plat = { x: 0, y: H - 24, oy: H - 24, w: W, kind: "ground", vx: 0, candy: false, crumbleAt: 0, fall: 0 };
    G = {
      state: "ready", t: 0, camY: 0, startY: H - 24, top: H - 24, plats: [ground], lastStep: ground, sparks: [], banner: null, next: 0, candies: 0,
      p: { x: W / 2 - 14, y: H - 24 - 28, w: 28, h: 28, vx: 0, vy: 0, ground: true, coyote: 0, buffer: 0, face: 1, squash: 0, ride: null },
    };
    while (G.top > -H) addStep(G.lastStep);
    updateScore();
  }
  const height = () => Math.max(0, Math.floor((G.startY - (G.p.y + G.p.h)) / PX));
  const score = () => height() + G.candies * 5;
  const updateScore = () => G && onScore(`${score()}m · best ${best}m`);

  function step(dt: number) {
    const p = G.p;
    G.t += dt;
    if (G.state !== "play") return;
    // run with a little inertia, wrap around the edges
    const want = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
    p.vx += (want * RUN - p.vx) * Math.min(1, 0.25 * dt);
    if (want) p.face = want;
    p.x += p.vx * dt;
    if (p.x > W) p.x = -p.w; else if (p.x < -p.w) p.x = W;
    // jump: coyote time + input buffer so it feels fair
    p.coyote = p.ground ? 6 : p.coyote - dt;
    p.buffer = keys.jump ? p.buffer : p.buffer - dt;
    if (p.buffer > 0 && p.coyote > 0) { p.vy = JUMP_V; p.ground = false; p.coyote = 0; p.buffer = 0; p.ride = null; p.squash = -0.25; }

    p.vy = Math.min(p.vy + GRAV * dt, 14);
    const prevBottom = p.y + p.h;
    p.y += p.vy * dt;
    if (p.ride) p.x += p.ride.vx * dt;
    p.ground = false;
    for (const pl of G.plats) {
      if (pl.kind === "moving") { pl.x += pl.vx * dt; if (pl.x < 0 || pl.x + pl.w > W) pl.vx *= -1; }
      if (pl.crumbleAt && G.t - pl.crumbleAt > 40) { pl.fall += 0.6 * dt; pl.y += pl.fall * dt; }
      if (pl.crumbleAt && G.t - pl.crumbleAt > 220) { pl.y = pl.oy; pl.fall = 0; pl.crumbleAt = 0; }
      if (p.vy >= 0 && prevBottom <= pl.y + 1 && p.y + p.h >= pl.y && p.x + p.w - 6 > pl.x && p.x + 6 < pl.x + pl.w && !(pl.fall > 0)) {
        if (p.vy > 3) p.squash = 0.3;
        p.y = pl.y - p.h; p.vy = 0; p.ground = true; p.ride = pl.kind === "moving" ? pl : null;
        if (pl.kind === "crumble" && !pl.crumbleAt) pl.crumbleAt = G.t;
        if (pl.candy) {
          pl.candy = false; G.candies++;
          for (let i = 0; i < 10; i++) G.sparks.push({ x: p.x + 14, y: p.y, vx: (Math.random() - 0.5) * 5, vy: -Math.random() * 4, life: 30 });
        }
      }
    }
    if (!p.ground) p.ride = null;
    p.squash *= 0.85;
    // camera only moves up; keep building platforms above
    G.camY = Math.min(G.camY, p.y - H * 0.42);
    while (G.top > G.camY - 120) addStep(G.lastStep);
    G.plats = G.plats.filter((pl) => pl.oy < G.camY + H + 60);
    for (const s of G.sparks) { s.x += s.vx * dt; s.y += s.vy * dt; s.vy += 0.2 * dt; s.life -= dt; }
    G.sparks = G.sparks.filter((s) => s.life > 0);
    const h = height();
    if (G.next < MILESTONES.length && h >= MILESTONES[G.next][0]) {
      G.banner = { text: `${MILESTONES[G.next][0]}m — ${MILESTONES[G.next][1]}`, until: G.t + 130 };
      G.next++;
    }
    updateScore();
    if (p.y > G.camY + H + 40) {
      G.state = "over";
      if (score() > best) { best = score(); store.set("rori-climb-best", String(best)); G.newBest = true; }
      updateScore();
    }
  }

  function drawSoot(x: number, y: number, face: number, squash: number, blink: boolean) {
    const cx = x + 14, cy = y + 14;
    ctx.save();
    ctx.translate(cx, cy + squash * 10);
    ctx.scale(1 + squash, 1 - squash);
    ctx.fillStyle = "#111";
    for (let i = 0; i < 22; i++) { // fuzz
      const a = (i / 22) * Math.PI * 2 + G.t * 0.02;
      ctx.beginPath(); ctx.arc(Math.cos(a) * 12, Math.sin(a) * 12, 3.4, 0, 7); ctx.fill();
    }
    ctx.beginPath(); ctx.arc(0, 0, 13, 0, 7); ctx.fill();
    const eyeH = blink ? 0.6 : 4.4;
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.ellipse(-4.5 + face, -2, 4.2, eyeH, 0, 0, 7); ctx.ellipse(4.5 + face, -2, 4.2, eyeH, 0, 0, 7); ctx.fill();
    if (!blink) {
      ctx.fillStyle = "#111";
      ctx.beginPath(); ctx.arc(-4.5 + face * 2.2, -1.6, 1.9, 0, 7); ctx.arc(4.5 + face * 2.2, -1.6, 1.9, 0, 7); ctx.fill();
    }
    ctx.restore();
  }
  function drawCandy(x: number, y: number, t: number) {
    ctx.save();
    ctx.translate(x, y + Math.sin(t * 0.08) * 2);
    ctx.rotate(t * 0.03);
    ctx.fillStyle = "#ff8fb8";
    ctx.beginPath();
    for (let i = 0; i < 10; i++) { const r = i % 2 ? 3.2 : 7, a = (i / 10) * Math.PI * 2; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  function draw() {
    const night = document.body.classList.contains("night");
    // sky darkens and fills with stars the higher you climb
    const k = Math.min((G.startY - G.camY) / (PX * 120), 1);
    const g = ctx.createLinearGradient(0, 0, 0, H);
    if (night) { g.addColorStop(0, "#070b1f"); g.addColorStop(1, "#1d2650"); }
    else { g.addColorStop(0, k > 0.5 ? "#6aa6d8" : "#9fd0ef"); g.addColorStop(1, "#e3f1e6"); }
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = night ? "rgba(255,248,220,.8)" : "rgba(255,255,255,.75)";
    for (let i = 0; i < 26; i++) {
      const sy = ((i * 97 + G.camY * -0.25) % (H + 40) + H + 40) % (H + 40) - 20;
      const sx = (i * 173) % W;
      if (night) { ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(G.t * 0.03 + i)); ctx.fillRect(sx, sy, 2, 2); }
      else { ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.ellipse(sx, sy, 34, 9, 0, 0, 7); ctx.fill(); }
    }
    ctx.globalAlpha = 1;
    ctx.save();
    ctx.translate(0, -G.camY);
    for (const pl of G.plats) {
      if (pl.kind === "ground") { ctx.fillStyle = night ? "#1b2a3a" : "#5f9a48"; ctx.fillRect(0, pl.y, W, 400); continue; }
      const shake = pl.crumbleAt && !pl.fall ? Math.sin(G.t * 1.5) * 1.5 : 0;
      ctx.fillStyle = pl.kind === "crumble" ? (night ? "#6e5a4a" : "#b89468") : pl.kind === "moving" ? (night ? "#3d4f86" : "#e9eef3") : (night ? "#34466e" : "#7a8f86");
      ctx.beginPath(); ctx.roundRect(pl.x + shake, pl.y, pl.w, 12, 6); ctx.fill();
      ctx.fillStyle = pl.kind === "moving" ? "rgba(255,255,255,.35)" : night ? "#7fd6a4" : "#6fa05e"; // moss / cloud top
      ctx.beginPath(); ctx.roundRect(pl.x + shake, pl.y - 2, pl.w, 5, 3); ctx.fill();
      if (pl.candy) drawCandy(pl.x + pl.w / 2, pl.y - 16, G.t);
    }
    for (const s of G.sparks) { ctx.globalAlpha = s.life / 30; ctx.fillStyle = "#ffd97a"; ctx.fillRect(s.x, s.y, 3, 3); }
    ctx.globalAlpha = 1;
    const p = G.p;
    drawSoot(p.x, p.y, p.face, p.squash, G.t % 220 < 8);
    if (p.x > W - p.w) drawSoot(p.x - W, p.y, p.face, p.squash, false);
    ctx.restore();

    ctx.textAlign = "center";
    const ink = night ? "#ece5d3" : "#1d2c26";
    if (G.banner && G.t < G.banner.until) {
      ctx.font = "italic 20px 'EB Garamond', Georgia, serif";
      ctx.fillStyle = ink; ctx.fillText(G.banner.text, W / 2, 40);
    }
    if (G.state !== "play") {
      ctx.fillStyle = night ? "rgba(16,21,42,.72)" : "rgba(238,242,236,.78)";
      ctx.fillRect(0, H / 2 - 90, W, 170);
      ctx.fillStyle = ink;
      ctx.font = "700 30px 'Space Grotesk', sans-serif";
      ctx.fillText(G.state === "ready" ? "help soot climb!" : G.newBest ? "new best! ✦" : "oof, you fell", W / 2, H / 2 - 36);
      ctx.font = "15px 'IBM Plex Mono', monospace";
      ctx.fillText(G.state === "over" ? `${height()}m climbed · ${G.candies} konpeito` : "grab konpeito for +5 each", W / 2, H / 2 - 4);
      ctx.fillStyle = night ? "#f0a35e" : "#b77a14";
      ctx.fillText(matchMedia("(pointer: coarse)").matches ? "tap jump to start" : "press space to start", W / 2, H / 2 + 32);
    }
  }
  function loop(now: number) {
    const dt = Math.min((now - last) / 16.667, 2.5);
    last = now;
    step(dt);
    draw();
    raf = requestAnimationFrame(loop);
  }

  return {
    keys,
    start() { sizeCanvas(); reset(); last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); },
    stop() { cancelAnimationFrame(raf); keys.left = keys.right = keys.jump = false; },
    pressJump() {
      if (G.state !== "play") { if (G.state === "over") reset(); G.state = "play"; }
      keys.jump = true;
      G.p.buffer = 7;
    },
    tapCanvas() { if (G.state !== "play") this.pressJump(); },
    resize() { sizeCanvas(); if (G.state !== "play") reset(); },
  };
}
