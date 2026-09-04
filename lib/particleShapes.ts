import { Shape } from "./timeline";

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function randomDir(): [number, number, number] {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  return [
    Math.sin(phi) * Math.cos(theta),
    Math.sin(phi) * Math.sin(theta),
    Math.cos(phi),
  ];
}

export type OrbitMeta = {
  // per-particle: null for non-orbiting particles (e.g. the sun's
  // own body), otherwise [radius, baseAngle, angularSpeed]
  radius: Float32Array;
  baseAngle: Float32Array;
  speed: Float32Array;
  isOrbiting: Uint8Array;
};

export type ShapeResult = {
  positions: Float32Array;
  colors: Float32Array;
  orbit?: OrbitMeta;
};

function fillSphereSurface(arr: Float32Array, count: number, radius: number, jitter = 0.05) {
  for (let i = 0; i < count; i++) {
    const [x, y, z] = randomDir();
    const r = radius + rand(-jitter, jitter);
    arr[i * 3] = x * r;
    arr[i * 3 + 1] = y * r;
    arr[i * 3 + 2] = z * r;
  }
}

function fillSphereVolume(arr: Float32Array, count: number, radius: number) {
  for (let i = 0; i < count; i++) {
    const [x, y, z] = randomDir();
    const r = radius * Math.cbrt(Math.random());
    arr[i * 3] = x * r;
    arr[i * 3 + 1] = y * r;
    arr[i * 3 + 2] = z * r;
  }
}

function fillBurst(arr: Float32Array, count: number, radius: number) {
  for (let i = 0; i < count; i++) {
    const [x, y, z] = randomDir();
    const r = radius * Math.pow(Math.random(), 0.4);
    arr[i * 3] = x * r;
    arr[i * 3 + 1] = y * r;
    arr[i * 3 + 2] = z * r;
  }
}

function fillSpiralGalaxy(arr: Float32Array, count: number, radius: number, arms = 3) {
  const bulgeCount = Math.floor(count * 0.12);
  for (let i = 0; i < count; i++) {
    if (i < bulgeCount) {
      // dense central bulge, like a real spiral galaxy's core
      const [x, y, z] = randomDir();
      const r = radius * 0.12 * Math.cbrt(Math.random());
      arr[i * 3] = x * r;
      arr[i * 3 + 1] = y * r * 0.6;
      arr[i * 3 + 2] = z * r;
      continue;
    }
    const t = Math.random();
    const arm = Math.floor(Math.random() * arms);
    const angle = t * Math.PI * 4 + (arm * (Math.PI * 2)) / arms;
    const r = radius * t + rand(-0.06, 0.06);
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    const y = rand(-0.035, 0.035) * (1 - t * 0.7);
    arr[i * 3] = x;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = z;
  }
}

// Real planets, in order, with their approximate real colors and a
// stylized (not-to-true-scale, or Mercury would be invisible next to
// Jupiter) relative size so each is still individually readable.
const PLANETS = [
  { name: "Mercury", color: "#9C9C94", size: 0.4, radius: 0.42 },
  { name: "Venus", color: "#E8D5A0", size: 0.55, radius: 0.58 },
  { name: "Earth", color: "#4A90D9", size: 0.58, radius: 0.74 },
  { name: "Mars", color: "#C1440E", size: 0.46, radius: 0.9 },
  { name: "Jupiter", color: "#C88B3A", size: 1.1, radius: 1.18 },
  { name: "Saturn", color: "#EAD6A0", size: 1.0, radius: 1.42 },
  { name: "Uranus", color: "#8AD4D4", size: 0.7, radius: 1.62 },
  { name: "Neptune", color: "#3454D1", size: 0.68, radius: 1.8 },
];
const SUN_COLOR = "#FFD27F";

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function fillSolarSystem(
  positions: Float32Array,
  colors: Float32Array,
  orbit: OrbitMeta,
  count: number
) {
  const sunCount = Math.floor(count * 0.22);
  const remaining = count - sunCount;
  const perPlanet = Math.floor(remaining / PLANETS.length);

  const [sr, sg, sb] = hexToRgb(SUN_COLOR);
  for (let i = 0; i < sunCount; i++) {
    const [x, y, z] = randomDir();
    const r = 0.2 * Math.cbrt(Math.random());
    positions[i * 3] = x * r;
    positions[i * 3 + 1] = y * r;
    positions[i * 3 + 2] = z * r;
    colors[i * 3] = sr;
    colors[i * 3 + 1] = sg;
    colors[i * 3 + 2] = sb;
    orbit.isOrbiting[i] = 0;
  }

  let idx = sunCount;
  PLANETS.forEach((planet, pIdx) => {
    const [pr, pg, pb] = hexToRgb(planet.color);
    // outer planets orbit slower — real physics (Kepler), just
    // compressed into a visually pleasant range instead of true AU speeds
    const speed = 0.55 / Math.pow(planet.radius, 1.5);
    const n = pIdx === PLANETS.length - 1 ? count - idx : perPlanet;

    for (let i = 0; i < n && idx < count; i++, idx++) {
      const baseAngle = Math.random() * Math.PI * 2;
      const r = planet.radius + rand(-0.015, 0.015) * planet.size;
      const wobble = rand(-0.02, 0.02) * planet.size;

      positions[idx * 3] = Math.cos(baseAngle) * r;
      positions[idx * 3 + 1] = wobble;
      positions[idx * 3 + 2] = Math.sin(baseAngle) * r;

      colors[idx * 3] = pr;
      colors[idx * 3 + 1] = pg;
      colors[idx * 3 + 2] = pb;

      orbit.radius[idx] = r;
      orbit.baseAngle[idx] = baseAngle;
      orbit.speed[idx] = speed;
      orbit.isOrbiting[idx] = 1;
    }
  });
}

function fillOcean(arr: Float32Array, count: number) {
  for (let i = 0; i < count; i++) {
    const x = rand(-1.5, 1.5);
    const z = rand(-1.5, 1.5);
    const y = Math.sin(x * 2) * 0.05 + Math.cos(z * 2) * 0.05 + rand(-0.03, 0.03) - 0.2;
    arr[i * 3] = x;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = z;
  }
}

function fillClusters(
  arr: Float32Array,
  count: number,
  clusterCount: number,
  spread: number,
  clusterRadius: number,
  yRange: [number, number]
) {
  const centers: [number, number, number][] = [];
  for (let c = 0; c < clusterCount; c++) {
    centers.push([rand(-spread, spread), rand(yRange[0], yRange[1]), rand(-spread, spread)]);
  }
  for (let i = 0; i < count; i++) {
    const c = centers[i % centers.length];
    const [dx, dy, dz] = randomDir();
    const r = clusterRadius * Math.cbrt(Math.random());
    arr[i * 3] = c[0] + dx * r;
    arr[i * 3 + 1] = c[1] + dy * r * 0.6;
    arr[i * 3 + 2] = c[2] + dz * r;
  }
}

function fillLand(arr: Float32Array, count: number) {
  for (let i = 0; i < count; i++) {
    const x = rand(-1.4, 1.4);
    const z = rand(-1.4, 1.4);
    const stalkChance = Math.random();
    let y: number;
    if (stalkChance > 0.5) {
      y = rand(-0.3, rand(0.2, 1.1));
    } else {
      y = rand(-0.3, -0.15);
    }
    arr[i * 3] = x;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = z;
  }
}

function fillImpact(arr: Float32Array, count: number) {
  for (let i = 0; i < count; i++) {
    const ringChance = Math.random();
    if (ringChance > 0.3) {
      const angle = Math.random() * Math.PI * 2;
      const r = rand(0.3, 1.6) * Math.random();
      arr[i * 3] = Math.cos(angle) * r;
      arr[i * 3 + 1] = rand(-0.05, 0.05);
      arr[i * 3 + 2] = Math.sin(angle) * r;
    } else {
      const [x, y, z] = randomDir();
      const r = rand(0.1, 1.2);
      arr[i * 3] = x * r;
      arr[i * 3 + 1] = Math.abs(y) * r * 1.2;
      arr[i * 3 + 2] = z * r;
    }
  }
}

function fillHuman(arr: Float32Array, count: number) {
  const segments: { from: [number, number, number]; to: [number, number, number]; r: number; weight: number }[] = [
    { from: [0, 1.05, 0], to: [0, 1.3, 0], r: 0.14, weight: 0.12 },
    { from: [0, 0.35, 0], to: [0, 1.0, 0], r: 0.13, weight: 0.28 },
    { from: [0, 0.9, 0], to: [-0.5, 0.3, 0], r: 0.07, weight: 0.12 },
    { from: [0, 0.9, 0], to: [0.5, 0.3, 0], r: 0.07, weight: 0.12 },
    { from: [0, 0.35, 0], to: [-0.22, -0.75, 0], r: 0.09, weight: 0.18 },
    { from: [0, 0.35, 0], to: [0.22, -0.75, 0], r: 0.09, weight: 0.18 },
  ];
  const total = segments.reduce((s, seg) => s + seg.weight, 0);
  let idx = 0;
  segments.forEach((seg) => {
    const n = Math.floor((seg.weight / total) * count);
    for (let i = 0; i < n && idx < count; i++, idx++) {
      const t = Math.random();
      const [dx, dy, dz] = randomDir();
      const r = seg.r * Math.cbrt(Math.random());
      const x = seg.from[0] + (seg.to[0] - seg.from[0]) * t + dx * r;
      const y = seg.from[1] + (seg.to[1] - seg.from[1]) * t + dy * r;
      const z = seg.from[2] + (seg.to[2] - seg.from[2]) * t + dz * r * 0.5;
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y - 0.2;
      arr[idx * 3 + 2] = z;
    }
  });
  for (; idx < count; idx++) {
    arr[idx * 3] = rand(-0.1, 0.1);
    arr[idx * 3 + 1] = rand(-0.9, 1.0);
    arr[idx * 3 + 2] = rand(-0.1, 0.1);
  }
}

function fillCivilization(arr: Float32Array, count: number) {
  const gridSize = Math.ceil(Math.sqrt(count));
  for (let i = 0; i < count; i++) {
    const gx = i % gridSize;
    const gz = Math.floor(i / gridSize) % gridSize;
    const x = (gx / gridSize - 0.5) * 2.6 + rand(-0.03, 0.03);
    const z = (gz / gridSize - 0.5) * 2.6 + rand(-0.03, 0.03);
    const height = Math.random() > 0.85 ? rand(0.1, 0.7) : rand(-0.02, 0.05);
    arr[i * 3] = x;
    arr[i * 3 + 1] = height - 0.3;
    arr[i * 3 + 2] = z;
  }
}

function fillNow(arr: Float32Array, count: number) {
  const dotCount = Math.floor(count * 0.7);
  for (let i = 0; i < count; i++) {
    if (i < dotCount) {
      const [x, y, z] = randomDir();
      const r = 0.16 * Math.cbrt(Math.random());
      arr[i * 3] = x * r;
      arr[i * 3 + 1] = y * r;
      arr[i * 3 + 2] = z * r;
    } else {
      const [x, y, z] = randomDir();
      const r = rand(1.2, 1.8);
      arr[i * 3] = x * r;
      arr[i * 3 + 1] = y * r;
      arr[i * 3 + 2] = z * r;
    }
  }
}

function paletteColors(colors: Float32Array, count: number, palette: string[]) {
  for (let i = 0; i < count; i++) {
    const [r, g, b] = hexToRgb(palette[i % palette.length]);
    colors[i * 3] = r;
    colors[i * 3 + 1] = g;
    colors[i * 3 + 2] = b;
  }
}

export function generateShape(shape: Shape, count: number, palette: string[]): ShapeResult {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  if (shape === "solarSystem") {
    const orbit: OrbitMeta = {
      radius: new Float32Array(count),
      baseAngle: new Float32Array(count),
      speed: new Float32Array(count),
      isOrbiting: new Uint8Array(count),
    };
    fillSolarSystem(positions, colors, orbit, count);
    return { positions, colors, orbit };
  }

  switch (shape) {
    case "explosion":
      fillBurst(positions, count, 1.4);
      break;
    case "plasma":
      fillSphereVolume(positions, count, 0.85);
      break;
    case "starfield":
      fillSphereSurface(positions, count, 1.7, 0.4);
      break;
    case "galaxy":
      fillSpiralGalaxy(positions, count, 1.3, 3);
      break;
    case "planet":
      fillSphereSurface(positions, count, 1.0, 0.08);
      break;
    case "ocean":
      fillOcean(positions, count);
      break;
    case "cambrian":
      fillClusters(positions, count, 9, 1.1, 0.18, [-0.3, 0.3]);
      break;
    case "land":
      fillLand(positions, count);
      break;
    case "dinosaur":
      fillClusters(positions, count, 5, 1.0, 0.35, [-0.2, 0.5]);
      break;
    case "impact":
      fillImpact(positions, count);
      break;
    case "mammal":
      fillClusters(positions, count, 12, 1.2, 0.14, [-0.3, 0.2]);
      break;
    case "human":
      fillHuman(positions, count);
      break;
    case "civilization":
      fillCivilization(positions, count);
      break;
    case "now":
      fillNow(positions, count);
      break;
    default:
      fillSphereVolume(positions, count, 1);
  }

  paletteColors(colors, count, palette);
  return { positions, colors };
}
