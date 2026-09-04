"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { TIMELINE } from "@/lib/timeline";
import { generateShape, ShapeResult } from "@/lib/particleShapes";

const PARTICLE_COUNT = 2600;

// how far back the camera sits for each shape family — pulled wide
// for big sparse structures (galaxies, starfields), pulled tight for
// small intimate ones (a lone figure, the pale dot of "now")
const CAMERA_DISTANCE: Record<string, number> = {
  explosion: 3.0,
  plasma: 2.6,
  starfield: 4.4,
  galaxy: 3.9,
  solarSystem: 3.4,
  planet: 2.2,
  ocean: 2.7,
  cambrian: 2.8,
  land: 2.8,
  dinosaur: 3.0,
  impact: 3.2,
  mammal: 2.8,
  human: 2.3,
  civilization: 3.0,
  now: 1.9,
};

/** A soft radial-gradient dot, generated at runtime on an offscreen
 *  canvas — used as the point-sprite texture so particles read as
 *  glowing points of light instead of flat squares. */
function useGlowTexture() {
  return useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.35, "rgba(255,255,255,0.7)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

/** A static, sparse, slowly-drifting starfield that's always present
 *  in the background — space isn't ever truly empty, and it gives
 *  every scene a sense of depth beyond the active particle formation. */
function BackgroundStars({ glowTexture }: { glowTexture: THREE.Texture }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 700;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 5 + Math.random() * 4;
      arr[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      arr[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
      arr[i * 3 + 2] = Math.cos(phi) * r;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.004;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={700} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        map={glowTexture}
        transparent
        opacity={0.35}
        color="#CFE8FF"
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function ParticleField({ activeIndex, glowTexture }: { activeIndex: number; glowTexture: THREE.Texture }) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  const shapeCache = useMemo<ShapeResult[]>(() => {
    return TIMELINE.map((era) => generateShape(era.shape, PARTICLE_COUNT, era.colors));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayPositions = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);
  const displayColors = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);

  const fromRef = useRef(shapeCache[0]);
  const toRef = useRef(shapeCache[0]);
  const blendRef = useRef({ t: 1 });
  const prevIndexRef = useRef(0);

  useEffect(() => {
    if (activeIndex === prevIndexRef.current) return;
    fromRef.current = {
      positions: new Float32Array(displayPositions),
      colors: new Float32Array(displayColors),
    };
    toRef.current = shapeCache[activeIndex];
    blendRef.current.t = 0;
    gsap.to(blendRef.current, { t: 1, duration: 1.8, ease: "power2.inOut" });
    prevIndexRef.current = activeIndex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  useEffect(() => {
    displayPositions.set(shapeCache[0].positions);
    displayColors.set(shapeCache[0].colors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state, delta) => {
    const t = blendRef.current.t;
    const from = fromRef.current;
    const to = toRef.current;
    const elapsed = state.clock.getElapsedTime();

    for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
      displayPositions[i] = THREE.MathUtils.lerp(from.positions[i], to.positions[i], t);
      displayColors[i] = THREE.MathUtils.lerp(from.colors[i], to.colors[i], t);
    }

    // real orbital motion: once we're blended into the solar-system
    // formation (or blending into it), planets continuously sweep
    // around the sun — inner planets faster, outer planets slower,
    // same relative pattern as Kepler's third law
    if (to.orbit) {
      const orbit = to.orbit;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        if (!orbit.isOrbiting[i]) continue;
        const angle = orbit.baseAngle[i] + elapsed * orbit.speed[i];
        const r = orbit.radius[i];
        const orbitX = Math.cos(angle) * r;
        const orbitZ = Math.sin(angle) * r;
        displayPositions[i * 3] = THREE.MathUtils.lerp(displayPositions[i * 3], orbitX, t);
        displayPositions[i * 3 + 2] = THREE.MathUtils.lerp(displayPositions[i * 3 + 2], orbitZ, t);
      }
    }

    const geom = pointsRef.current?.geometry;
    if (geom) {
      (geom.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (geom.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    }

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.045;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_COUNT}
            array={displayPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={PARTICLE_COUNT}
            array={displayColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          map={glowTexture}
          vertexColors
          transparent
          opacity={0.95}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function CameraRig({ activeIndex }: { activeIndex: number }) {
  const targetDistance = useRef(3.4);
  const currentDistance = useRef(3.4);

  useEffect(() => {
    const shape = TIMELINE[activeIndex]?.shape;
    targetDistance.current = CAMERA_DISTANCE[shape] ?? 3.2;
  }, [activeIndex]);

  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime();
    currentDistance.current = THREE.MathUtils.lerp(
      currentDistance.current,
      targetDistance.current,
      0.025
    );

    camera.position.x = Math.sin(t * 0.08) * 0.3;
    camera.position.y = 0.1 + Math.cos(t * 0.06) * 0.15;
    camera.position.z = currentDistance.current;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Scene({ activeIndex }: { activeIndex: number }) {
  const glowTexture = useGlowTexture();

  return (
    <Canvas
      camera={{ position: [0, 0.1, 3.4], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.6]}
    >
      <BackgroundStars glowTexture={glowTexture} />
      <ParticleField activeIndex={activeIndex} glowTexture={glowTexture} />
      <CameraRig activeIndex={activeIndex} />
    </Canvas>
  );
}
