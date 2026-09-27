import type * as ThreeNS from "three";

/* The fitting-room figure: a realistically proportioned fashion mannequin of me (locs, brown skin,
   smooth featureless face), wearing clothes built as fabric: quilted puffer baffles, creased wide
   pants, fluffy fur trim. Outfits come from the photos in Documents/outfits. */

export type Outfit = {
  id: string; name: string; note: string; swatches: string[];
  head?: { kind: "beanie" | "cap" | "newsboy" | "hood"; color: string; fur?: string };
  shades?: boolean;
  top: { kind: "puffer" | "jacket" | "hoodie" | "shirt" | "tee"; color: string; pattern?: "plaid" | "denim"; accent?: string; collar?: string; trim?: string };
  scarf?: { color: string; stripe: string };
  pants: { color: string; wide?: boolean; pattern?: "denim" | "distressed" | "seams"; accent?: string };
  shoes: { kind: "boot" | "sneaker"; color: string; sole?: string };
  gloves?: string; backpack?: string;
};

export const OUTFITS: Outfit[] = [
  {
    id: "puffer", name: "puffer season", note: "black hooded puffer · grey paneled wide pants",
    swatches: ["#141518", "#b8a58a", "#d6d2c6", "#1c1c1f"],
    head: { kind: "hood", color: "#141518", fur: "#8f7a5e" },
    top: { kind: "puffer", color: "#141518" },
    pants: { color: "#d6d2c6", wide: true, pattern: "seams", accent: "#a19c8f" },
    shoes: { kind: "boot", color: "#1c1c1f", sole: "#2a2a2a" }, gloves: "#0f0f11",
  },
  {
    id: "fur", name: "fur collar", note: "black beanie · brown jacket · charcoal jeans",
    swatches: ["#141414", "#4f3726", "#8c6d52", "#3a3d42"],
    head: { kind: "beanie", color: "#141414" }, shades: true,
    top: { kind: "jacket", color: "#4f3726", collar: "#8c6d52" },
    pants: { color: "#3a3d42", wide: true, pattern: "denim" },
    shoes: { kind: "sneaker", color: "#f2f1ed", sole: "#e4e2dc" },
  },
  {
    id: "blue", name: "blue zip-up", note: "blue hoodie · camo cargos",
    swatches: ["#1d3caa", "#f0f0f0", "#b5ae90", "#8e8f8c"],
    head: { kind: "hood", color: "#1d3caa" },
    top: { kind: "hoodie", color: "#1d3caa", trim: "#f0f0f0" },
    pants: { color: "#b5ae90", wide: true, pattern: "distressed", accent: "#6f6a52" },
    shoes: { kind: "sneaker", color: "#8e8f8c", sole: "#cfcfcf" },
  },
  {
    id: "scarf", name: "pink scarf", note: "grey beanie · cream knit · light denim",
    swatches: ["#9a9a98", "#d4cec2", "#e6b8c8", "#9aa6ad"],
    head: { kind: "beanie", color: "#9a9a98" }, shades: true,
    top: { kind: "jacket", color: "#d4cec2" },
    scarf: { color: "#ecc6d3", stripe: "#b86f8a" },
    pants: { color: "#9aa6ad", wide: true, pattern: "denim" },
    shoes: { kind: "sneaker", color: "#f2f1ed", sole: "#e4e2dc" },
  },
  {
    id: "plaid", name: "plaid + cap", note: "blue plaid shirt · light cap · khakis",
    swatches: ["#a9b8cc", "#34488a", "#bdb895", "#6b4a33"],
    head: { kind: "cap", color: "#a9b8cc" },
    top: { kind: "shirt", color: "#34488a", pattern: "plaid", accent: "#c9d3e6" },
    pants: { color: "#bdb895", wide: true, pattern: "distressed", accent: "#8a8561" },
    shoes: { kind: "boot", color: "#6b4a33", sole: "#3a2a1e" },
  },
  {
    id: "denim", name: "newsboy", note: "newsboy cap · dark denim jacket · brown trousers",
    swatches: ["#5b4a3c", "#1d2436", "#3b2e25", "#111111"],
    head: { kind: "newsboy", color: "#5b4a3c" }, shades: true,
    top: { kind: "jacket", color: "#1d2436", pattern: "denim" },
    pants: { color: "#3b2e25", wide: true },
    shoes: { kind: "boot", color: "#111111", sole: "#1d1d1d" },
  },
  {
    id: "hike", name: "yosemite", note: "all black · backpack",
    swatches: ["#121212", "#1b1b1b", "#232323", "#0c0c0c"],
    head: { kind: "beanie", color: "#121212" },
    top: { kind: "tee", color: "#1b1b1b" },
    pants: { color: "#232323" },
    shoes: { kind: "sneaker", color: "#2a2a2a", sole: "#3a3a3a" }, backpack: "#0f0f10",
  },
];

const SKIN = "#6f4128";
const HAIR = "#17100b";

type V3 = [number, number, number];

export function createFigure(T: typeof ThreeNS, RoundedBox: typeof import("three/examples/jsm/geometries/RoundedBoxGeometry.js").RoundedBoxGeometry) {
  const root = new T.Group();
  const body = new T.Group();
  root.add(body);

  const tex = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep?: [number, number]) => {
    const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
    draw(cv.getContext("2d")!);
    const t = new T.CanvasTexture(cv); t.colorSpace = T.SRGBColorSpace;
    if (rep) { t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(...rep); }
    return t;
  };
  const pattern = (color: string, kind?: string, accent?: string) => {
    if (!kind) return undefined;
    return tex(256, 256, (g) => {
      g.fillStyle = color; g.fillRect(0, 0, 256, 256);
      if (kind === "plaid") {
        g.globalAlpha = 0.5; g.fillStyle = accent ?? "#fff";
        for (let i = 0; i < 256; i += 48) { g.fillRect(i, 0, 14, 256); g.fillRect(0, i, 256, 14); }
        g.globalAlpha = 0.5; g.fillStyle = "#0d1430";
        for (let i = 24; i < 256; i += 48) { g.fillRect(i, 0, 5, 256); g.fillRect(0, i, 256, 5); }
      } else if (kind === "denim") {
        for (let i = 0; i < 3000; i++) { g.fillStyle = `rgba(255,255,255,${Math.random() * 0.1})`; g.fillRect(Math.random() * 256, Math.random() * 256, 1, 3); }
      } else if (kind === "distressed") {
        for (let i = 0; i < 30; i++) {
          g.fillStyle = accent ?? "#000"; g.globalAlpha = 0.15 + Math.random() * 0.2;
          g.beginPath(); g.ellipse(Math.random() * 256, Math.random() * 256, 8 + Math.random() * 24, 6 + Math.random() * 18, Math.random() * 3, 0, 7); g.fill();
        }
      } else if (kind === "seams") {
        g.strokeStyle = accent ?? "#999"; g.globalAlpha = 0.45; g.lineWidth = 2;
        for (let y = 30; y < 256; y += 85) { g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(80, y + 16, 170, y - 12, 256, y + 6); g.stroke(); }
      }
    }, [3, 3]);
  };

  // cloth: matte with sheen; nylon: a little gloss; skin: soft satin
  const cloth = (color: string, map?: ThreeNS.Texture, rough = 0.85) =>
    new T.MeshPhysicalMaterial({ color: map ? "#ffffff" : color, map, roughness: rough, sheen: 0.25, sheenRoughness: 0.8, sheenColor: new T.Color(color).lerp(new T.Color("#ffffff"), 0.35) });
  const nylon = (color: string) => new T.MeshPhysicalMaterial({ color, roughness: 0.5, clearcoat: 0.2, clearcoatRoughness: 0.55 });
  const skin = new T.MeshPhysicalMaterial({ color: SKIN, roughness: 0.48, sheen: 0.35, sheenRoughness: 0.5, sheenColor: new T.Color("#c98f6a") });

  // a lathe-like surface from a (y, r) profile, with an optional per-vertex radius tweak
  // (angle, y, t) → multiplier, which gives creases, quilting and fluff
  function surface(profile: [number, number][], seg: number, tweak?: (a: number, y: number, t: number) => number, sx = 1, sz = 1) {
    const pos: number[] = [], uv: number[] = [], idx: number[] = [];
    const n = profile.length;
    for (let j = 0; j < n; j++) {
      const [y, r] = profile[j];
      for (let i = 0; i <= seg; i++) {
        const a = (i / seg) * Math.PI * 2;
        const k = tweak ? tweak(a, y, j / (n - 1)) : 1;
        pos.push(Math.sin(a + Math.PI) * r * k * sx, y, Math.cos(a + Math.PI) * r * k * sz); // seam at the back
        uv.push(i / seg, j / (n - 1));
      }
    }
    for (let j = 0; j < n - 1; j++) for (let i = 0; i < seg; i++) {
      const a = j * (seg + 1) + i, b = a + seg + 1;
      idx.push(a, a + 1, b, b, a + 1, b + 1); // wound so faces point outward
    }
    const g = new T.BufferGeometry();
    g.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
    g.setAttribute("uv", new T.Float32BufferAttribute(uv, 2));
    g.setIndex(idx); g.computeVertexNormals();
    return g;
  }
  // smooth profile from a few control points
  const smooth = (pts: [number, number][], steps = 48): [number, number][] => {
    const c = new T.SplineCurve(pts.map(([y, r]) => new T.Vector2(y, r)));
    return c.getPoints(steps).map((v) => [v.x, v.y]);
  };

  const mesh = (geo: ThreeNS.BufferGeometry, m: ThreeNS.Material, parent: ThreeNS.Object3D = body, p: V3 = [0, 0, 0], s: V3 = [1, 1, 1], r?: V3) => {
    const o = new T.Mesh(geo, m);
    o.position.set(...p); o.scale.set(...s);
    if (r) o.rotation.set(...r);
    o.castShadow = true; o.receiveShadow = true;
    parent.add(o);
    return o;
  };
  const sphere = new T.SphereGeometry(1, 48, 32);
  // a tube swept along a smooth curve, radius varying along its length: sleeves and arms
  const sweep = (pts: V3[], radius: (t: number) => number, m: ThreeNS.Material, tweak?: (a: number, t: number) => number, parent: ThreeNS.Object3D = body) => {
    const curve = new T.CatmullRomCurve3(pts.map((p) => new T.Vector3(...p)));
    const segs = 60, rad = 40;
    const frames = curve.computeFrenetFrames(segs, false);
    const pos: number[] = [], uv: number[] = [], idx: number[] = [];
    for (let j = 0; j <= segs; j++) {
      const t = j / segs, c = curve.getPointAt(t), N = frames.normals[j], Bn = frames.binormals[j];
      for (let i = 0; i <= rad; i++) {
        const a = (i / rad) * Math.PI * 2;
        const r = radius(t) * (tweak ? tweak(a, t) : 1);
        pos.push(c.x + r * (Math.cos(a) * N.x + Math.sin(a) * Bn.x), c.y + r * (Math.cos(a) * N.y + Math.sin(a) * Bn.y), c.z + r * (Math.cos(a) * N.z + Math.sin(a) * Bn.z));
        uv.push(i / rad, t * 3); // so patterns (plaid, denim) continue onto sleeves
      }
    }
    for (let j = 0; j < segs; j++) for (let i = 0; i < rad; i++) { const a = j * (rad + 1) + i, b = a + rad + 1; idx.push(a, a + 1, b, b, a + 1, b + 1); }
    const g = new T.BufferGeometry();
    g.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
    g.setAttribute("uv", new T.Float32BufferAttribute(uv, 2));
    g.setIndex(idx); g.computeVertexNormals();
    return mesh(g, m, parent);
  };

  // display plinth
  const plinth = mesh(new T.CylinderGeometry(0.42, 0.44, 0.06, 96), new T.MeshStandardMaterial({ color: "#e9e4da", roughness: 0.6 }), root, [0, 0.03, 0]);
  plinth.castShadow = false;
  const G = 0.06; // ground level on the plinth

  function dress(o: Outfit) {
    body.clear();
    const topMat = o.top.kind === "puffer" ? nylon(o.top.color) : cloth(o.top.color, pattern(o.top.color, o.top.pattern, o.top.accent), o.top.pattern === "denim" ? 0.9 : 0.8);
    const pantsMat = cloth(o.pants.color, pattern(o.pants.color, o.pants.pattern, o.pants.accent), 0.9);
    const shoeMat = o.shoes.kind === "boot" ? new T.MeshPhysicalMaterial({ color: o.shoes.color, roughness: 0.35, clearcoat: 0.5 }) : cloth(o.shoes.color, undefined, 0.7);
    const soleMat = cloth(o.shoes.sole ?? "#333", undefined, 0.8);

    // ---- shoes: a sole and a rounded upper, toe pointing forward
    for (const sd of [-1, 1]) {
      const x = 0.1 * sd, boot = o.shoes.kind === "boot", k = boot ? 1.1 : 1;
      mesh(new RoundedBox(0.112 * k, 0.03, 0.29 * k, 4, 0.014), soleMat, body, [x, G + 0.016, 0.04]);
      mesh(new RoundedBox(0.1 * k, 0.085 * k, 0.26 * k, 6, 0.04), shoeMat, body, [x, G + 0.068, 0.035]);
    }

    // ---- legs + pants (wide pants: straight, with soft vertical creases stacking at the hem)
    const hem = G + (o.pants.wide ? 0.045 : 0.1);
    for (const s of [-1, 1]) {
      const x = 0.098 * s;
      const prof = o.pants.wide
        ? smooth([[hem, 0.13], [0.25, 0.122], [0.5, 0.115], [0.75, 0.115], [0.9, 0.112]])
        : smooth([[hem, 0.07], [0.3, 0.065], [0.5, 0.075], [0.75, 0.085], [0.9, 0.105]]);
      const folds = (a: number, y: number) => {
        const stack = Math.max(0, 1 - (y - hem) / 0.35); // bunches up near the hem
        return 1 + 0.03 * Math.sin(a * 6 + y * 11 + s) + 0.06 * stack * Math.sin(a * 9 + y * 40) + 0.035 * stack * Math.abs(Math.sin(y * 70));
      };
      mesh(surface(prof, 64, folds, 1, 0.92), pantsMat, body, [x, 0, 0]);
    }
    mesh(surface(smooth([[0.84, 0.15], [0.94, 0.16], [1.02, 0.15]]), 64, undefined, 1.02, 0.64), pantsMat);

    // ---- torso / top
    const puffer = o.top.kind === "puffer";
    const hemY = puffer ? 0.8 : o.top.kind === "tee" || o.top.kind === "shirt" ? 0.88 : 0.84;
    const w = puffer ? 1.18 : 1;
    const topProf = smooth([[hemY, 0.19 * w], [0.98, 0.178 * w], [1.14, 0.18 * w], [1.3, 0.19 * w], [1.4, 0.17 * w], [1.46, 0.12], [1.5, 0.075]], 64);
    const quilt = puffer ? (_a: number, y: number) => 1 + 0.06 * Math.abs(Math.sin(((y - hemY) / 0.1) * Math.PI)) : undefined;
    mesh(surface(topProf, 80, quilt, 1.2, 0.72), topMat);
    // collar / neck opening
    if (o.top.collar) mesh(surface(smooth([[1.4, 0.13], [1.47, 0.12], [1.52, 0.1]]), 48, (a, y) => 1 + 0.08 * Math.sin(a * 13 + y * 60), 1.05, 0.85), cloth(o.top.collar, undefined, 1));
    else if (puffer || o.top.kind === "jacket") mesh(surface(smooth([[1.42, 0.1], [1.5, 0.085], [1.55, 0.08]]), 48, undefined, 1, 0.95), topMat);
    if (o.top.trim) mesh(new T.BoxGeometry(0.012, 0.52, 0.012), cloth(o.top.trim, undefined, 0.5), body, [0, 1.16, 0.152]);
    if (o.scarf) {
      const sm = cloth(o.scarf.color, tex(64, 64, (g) => { g.fillStyle = o.scarf!.color; g.fillRect(0, 0, 64, 64); g.fillStyle = o.scarf!.stripe; for (let i = 0; i < 64; i += 16) g.fillRect(0, i, 64, 5); }, [1, 4]), 1);
      mesh(surface(smooth([[1.43, 0.115], [1.5, 0.105], [1.55, 0.095]]), 48, (a, y) => 1 + 0.1 * Math.sin(a * 5 + y * 40), 1.05, 1), sm);
      mesh(new RoundedBox(0.07, 0.4, 0.025, 2, 0.01), sm, body, [0.06, 1.25, 0.16], [1, 1, 1], [0.05, 0, 0.05]);
    }
    if (o.backpack) {
      const bm = cloth(o.backpack, undefined, 0.6);
      mesh(new RoundedBox(0.3, 0.42, 0.14, 4, 0.05), bm, body, [0, 1.17, -0.2]);
      for (const s of [-1, 1]) mesh(new T.TorusGeometry(0.19, 0.014, 8, 24, Math.PI), bm, body, [0.1 * s, 1.2, -0.02], [1, 1.1, 0.55], [0, Math.PI / 2, Math.PI / 2]);
    }

    // ---- arms: relaxed, slightly bent, one smooth sleeve from the shoulder to the cuff
    const sleeveR = puffer ? 0.066 : o.top.kind === "tee" ? 0.05 : 0.056;
    const sleeveQuilt = puffer ? (_a: number, t: number) => 1 + 0.1 * Math.abs(Math.sin(t * Math.PI * 4)) : undefined;
    const hm = o.gloves ? new T.MeshStandardMaterial({ color: o.gloves, roughness: 0.6 }) : skin;
    for (const sd of [-1, 1]) {
      const path: V3[] = [[0.16 * sd, 1.4, -0.01], [0.245 * sd, 1.37, -0.01], [0.285 * sd, 1.14, 0.0], [0.29 * sd, 0.95, 0.05], [0.28 * sd, 0.86, 0.075]];
      if (o.top.kind === "tee") {
        sweep(path.slice(0, 3).map((p, i) => (i === 2 ? [0.275 * sd, 1.25, -0.005] : p)) as V3[], (t) => sleeveR * (1.15 - 0.1 * t), topMat);
        sweep([[0.262 * sd, 1.29, -0.005], path[2], path[3], path[4]], (t) => 0.043 - 0.012 * t, skin);
      } else {
        sweep(path, (t) => sleeveR * (1.35 - 0.45 * t + (t > 0.93 ? 0.08 : 0)), topMat, sleeveQuilt);
      }
      // hand, relaxed, coming out of the cuff
      const cuff = new T.Vector3(...path[4]);
      mesh(sphere, hm, body, [cuff.x, cuff.y - 0.055, cuff.z + 0.012], [0.03, 0.058, 0.045], [0.12, 0, 0.08 * sd]);
      mesh(sphere, hm, body, [cuff.x - 0.012 * sd, cuff.y - 0.045, cuff.z + 0.045], [0.014, 0.03, 0.014], [0.45, 0, 0.3 * sd]);
    }

    // ---- neck + head (smooth, fashion-mannequin face)
    mesh(new T.CylinderGeometry(0.048, 0.056, 0.14, 32), skin, body, [0, 1.52, 0.0]);
    const head = new T.Group(); head.position.set(0, 1.665, 0.01); body.add(head);
    mesh(sphere, skin, head, [0, 0, 0], [0.086, 0.108, 0.098]);
    mesh(sphere, skin, head, [0, -0.055, 0.02], [0.07, 0.058, 0.075]); // jaw + chin
    mesh(sphere, skin, head, [0, -0.005, 0.094], [0.016, 0.026, 0.02]); // nose
    mesh(sphere, new T.MeshPhysicalMaterial({ color: "#5a3020", roughness: 0.4 }), head, [0, -0.052, 0.086], [0.024, 0.009, 0.012]); // lips
    for (const s of [-1, 1]) {
      mesh(sphere, skin, head, [0.087 * s, -0.005, 0.0], [0.012, 0.024, 0.016]); // ears
      mesh(sphere, skin, head, [0.035 * s, 0.028, 0.085], [0.028, 0.01, 0.014]); // brow ridge
    }

    // locs: lots of thin ropes falling from the scalp to the shoulders
    const hairM = new T.MeshPhysicalMaterial({ color: HAIR, roughness: 0.75, sheen: 0.3, sheenColor: new T.Color("#5a4535") });
    const hooded = o.head?.kind === "hood";
    for (let i = 0; i < 44; i++) {
      const a = Math.PI * 0.32 + (i / 43) * Math.PI * 1.36; // around the sides and back, not the face
      const top = 0.06 + (i % 3) * 0.015;
      const sx = Math.sin(a), cz = Math.cos(a);
      const start = new T.Vector3(sx * 0.085, top, cz * 0.095);
      const len = hooded ? 0.18 + (i % 4) * 0.02 : 0.24 + (i % 5) * 0.03;
      const pts = [start, new T.Vector3(sx * 0.11, top - len * 0.35, cz * 0.12 - 0.01), new T.Vector3(sx * 0.12, top - len * 0.7, cz * 0.12 - 0.02), new T.Vector3(sx * 0.115, top - len, cz * 0.115 - 0.03)];
      mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 20, 0.0085, 8), hairM, head);
      mesh(sphere, hairM, head, [pts[3].x, pts[3].y, pts[3].z], [0.009, 0.009, 0.009]);
    }
    if (!hooded) mesh(sphere, hairM, head, [0, 0.02, -0.004], [0.091, 0.1, 0.1]); // scalp coverage under hats

    // headwear
    const h = o.head;
    if (h?.kind === "beanie") {
      const m = cloth(h.color, undefined, 0.95);
      mesh(surface(smooth([[0.02, 0.1], [0.07, 0.095], [0.11, 0.07], [0.125, 0.0]], 24), 48, (a) => 1 + 0.02 * Math.sin(a * 30), 1, 1.05), m, head);
      mesh(surface(smooth([[0.0, 0.103], [0.035, 0.102]], 4), 48, undefined, 1, 1.05), m, head);
    } else if (h?.kind === "cap" || h?.kind === "newsboy") {
      const m = cloth(h.color, undefined, 0.8);
      const flat = h.kind === "newsboy";
      mesh(surface(smooth(flat ? [[0.04, 0.108], [0.08, 0.112], [0.11, 0.07], [0.12, 0]] : [[0.035, 0.098], [0.08, 0.09], [0.115, 0.055], [0.125, 0]], 20), 48, undefined, 1, 1.07), m, head);
      mesh(new T.CylinderGeometry(0.09, 0.09, 0.008, 32, 1, false, -Math.PI / 2.6, Math.PI / 1.3), m, head, [0, flat ? 0.05 : 0.045, flat ? 0.07 : 0.085], [1, 1, flat ? 0.75 : 1.1], [flat ? 0.1 : 0.15, 0, 0]);
    } else if (h?.kind === "hood") {
      const m = o.top.kind === "puffer" ? nylon(h.color) : cloth(h.color, undefined, 0.85);
      m.side = T.DoubleSide;
      const quiltHood = o.top.kind === "puffer" ? (_a: number, y: number) => 1 + 0.06 * Math.abs(Math.sin((y / 0.06) * Math.PI)) : undefined;
      // a hood is a lathe shell tipped forward, with the front opening cut away
      const shell = surface(smooth([[-0.2, 0.13], [-0.1, 0.145], [0.0, 0.14], [0.08, 0.12], [0.14, 0.06], [0.155, 0]], 30), 64, quiltHood);
      const posA = shell.getAttribute("position");
      const keep: number[] = [];
      const index = shell.getIndex()!;
      for (let f = 0; f < index.count; f += 3) {
        const ids = [index.getX(f), index.getX(f + 1), index.getX(f + 2)];
        const front = ids.every((v) => posA.getZ(v) > 0.05 && posA.getY(v) < 0.1 && posA.getY(v) > -0.15);
        if (!front) keep.push(...ids);
      }
      shell.setIndex(keep); shell.computeVertexNormals();
      mesh(shell, m, head, [0, 0.0, -0.01]);
      if (h.fur) {
        // fluffy trim around the face opening
        const fur = new T.TorusGeometry(0.115, 0.03, 24, 96);
        const fp = fur.getAttribute("position");
        for (let v = 0; v < fp.count; v++) {
          const k = 1 + 0.35 * (Math.random() - 0.3);
          const x = fp.getX(v), y = fp.getY(v), z = fp.getZ(v);
          const cx = x / Math.hypot(x, y) * 0.115, cy = y / Math.hypot(x, y) * 0.115;
          fp.setXYZ(v, cx + (x - cx) * k, cy + (y - cy) * k, z * k);
        }
        fur.computeVertexNormals();
        mesh(fur, new T.MeshStandardMaterial({ color: h.fur, roughness: 1 }), head, [0, -0.025, 0.075], [0.95, 1.2, 1]);
      }
    }
    if (o.shades) {
      const lens = new T.MeshPhysicalMaterial({ color: "#070708", roughness: 0.05, clearcoat: 1, metalness: 0.3 });
      for (const s of [-1, 1]) mesh(new RoundedBox(0.052, 0.026, 0.008, 3, 0.006), lens, head, [0.032 * s, 0.012, 0.098], [1, 1, 1], [0, 0.22 * s, 0]);
      mesh(new T.BoxGeometry(0.02, 0.005, 0.005), lens, head, [0, 0.018, 0.103]);
      for (const s of [-1, 1]) mesh(new T.BoxGeometry(0.004, 0.005, 0.09), lens, head, [0.086 * s, 0.015, 0.055]);
    }
  }

  return { root, dress };
}
