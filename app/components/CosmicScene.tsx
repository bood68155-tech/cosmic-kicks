'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════
   PROCEDURAL PLANET TEXTURES
   ═══════════════════════════════════════════════════════ */

function createGasGiantTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, '#c8a050'); g.addColorStop(0.2, '#d4b06a');
  g.addColorStop(0.35, '#a08040'); g.addColorStop(0.5, '#c8a050');
  g.addColorStop(0.65, '#8a6a30'); g.addColorStop(0.8, '#b8904a');
  g.addColorStop(1, '#c8a050');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = `rgba(200,160,80,${0.05 + Math.random() * 0.15})`;
    ctx.fillRect(0, Math.random() * 512, 512, 5 + Math.random() * 15);
  }
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * 512, y = Math.random() * 512, r = 10 + Math.random() * 40;
    const sg = ctx.createRadialGradient(x, y, 0, x, y, r);
    sg.addColorStop(0, `rgba(220,190,140,${0.1 + Math.random() * 0.2})`);
    sg.addColorStop(1, 'rgba(200,160,80,0)');
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.6, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function createRockyPlanetTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#c06030'; ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 512, y = Math.random() * 512, r = 5 + Math.random() * 30;
    ctx.beginPath(); ctx.arc(x + 2, y + 2, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,0,0,${0.1 + Math.random() * 0.2})`; ctx.fill();
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200,100,50,${0.1 + Math.random() * 0.15})`; ctx.fill();
    ctx.beginPath(); ctx.arc(x, y, r * 0.7, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(80,30,10,${0.2 + Math.random() * 0.3})`; ctx.fill();
  }
  for (let i = 0; i < 500; i++) {
    ctx.fillStyle = `rgba(${160 + Math.random() * 60},${80 + Math.random() * 40},${40 + Math.random() * 30},0.05)`;
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function createIcePlanetTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#4080a8'; ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 50; i++) {
    ctx.strokeStyle = `rgba(200,230,255,${0.1 + Math.random() * 0.3})`;
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    let x = Math.random() * 512, y = Math.random() * 512;
    ctx.moveTo(x, y);
    for (let j = 0; j < 10; j++) {
      x += (Math.random() - 0.5) * 30; y += (Math.random() - 0.5) * 15;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * 512, y = Math.random() * 512, r = 15 + Math.random() * 50;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `rgba(180,220,255,${0.15 + Math.random() * 0.25})`);
    grad.addColorStop(1, 'rgba(64,128,168,0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function createLavaPlanetTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#1a0a05'; ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 20; i++) {
    ctx.strokeStyle = `rgba(255,${100 + Math.random() * 80},20,${0.3 + Math.random() * 0.5})`;
    ctx.lineWidth = 2 + Math.random() * 5;
    ctx.shadowColor = '#ff4000'; ctx.shadowBlur = 10;
    ctx.beginPath();
    let x = Math.random() * 512, y = Math.random() * 512;
    ctx.moveTo(x, y);
    for (let j = 0; j < 15; j++) {
      x += (Math.random() - 0.5) * 40; y += (Math.random() - 0.5) * 20;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
  for (let i = 0; i < 12; i++) {
    const x = Math.random() * 512, y = Math.random() * 512, r = 8 + Math.random() * 25;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `rgba(255,${150 + Math.random() * 80},30,${0.4 + Math.random() * 0.4})`);
    grad.addColorStop(1, 'rgba(100,20,5,0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

let _textures: any = null;
function getTextures() {
  if (!_textures) {
    _textures = {
      gasGiant: createGasGiantTexture(),
      rocky: createRockyPlanetTexture(),
      ice: createIcePlanetTexture(),
      lava: createLavaPlanetTexture(),
    };
  }
  return _textures;
}

/* ═══════════════════════════════════════════════════════
   STARS — 3000 particle system with sine-wave twinkle
   ═══════════════════════════════════════════════════════ */

function Stars() {
  const ref = useRef<THREE.Points>(null!);
  const count = 3000;
  const { pos, col, bSz, spd, off } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const c = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const sd = new Float32Array(count);
    const of = new Float32Array(count);
    const palettes: [number, number, number][] = [[1,1,1],[0.7,0.8,1],[1,0.9,0.7],[1,0.7,0.7],[1,0.95,0.7]];
    for (let i = 0; i < count; i++) {
      const radius = 50 + Math.random() * 150;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      p[i*3] = radius * Math.sin(phi) * Math.cos(theta);
      p[i*3+1] = radius * Math.cos(phi);
      p[i*3+2] = radius * Math.sin(phi) * Math.sin(theta);
      const pal = palettes[Math.floor(Math.random() * 5)];
      const bright = 0.6 + Math.random() * 0.4;
      c[i*3] = pal[0] * bright; c[i*3+1] = pal[1] * bright; c[i*3+2] = pal[2] * bright;
      sz[i] = 0.3 + Math.random() * 1.8;
      sd[i] = 0.5 + Math.random() * 2.5;
      of[i] = Math.random() * Math.PI * 2;
    }
    return { pos: p, col: c, bSz: sz, spd: sd, off: of };
  }, []);

  const sizes = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) arr[i] = bSz[i];
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const geom = ref.current.geometry;
    let attr = geom.attributes.size;
    if (!attr) { geom.setAttribute('size', new THREE.BufferAttribute(sizes, 1)); attr = geom.attributes.size; }
    const arr = attr.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      arr[i] = bSz[i] * (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * spd[i] + off[i])));
    }
    attr.needsUpdate = true;
    ref.current.rotation.y = t * 0.005;
    ref.current.rotation.x = Math.sin(t * 0.002) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <float32BufferAttribute attach="attributes-position" args={[pos, 3]} />
        <float32BufferAttribute attach="attributes-color" args={[col, 3]} />
        <float32BufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial size={1.5} vertexColors transparent opacity={0.9} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

/* ═══════════════════════════════════════════════════════
   PLANET — rotation, orbital path, rings, atmosphere glow
   ═══════════════════════════════════════════════════════ */

interface PlanetProps {
  texture?: THREE.CanvasTexture;
  color?: string;
  size: number;
  position: [number, number, number];
  rotationSpeed?: number;
  orbitSpeed?: number;
  orbitRadius?: number;
  hasRings?: boolean;
  ringColor?: string;
  ringSize?: number;
  emissive?: string;
  emissiveIntensity?: number;
}

function Planet({ texture, color = '#8a6a30', size, position, rotationSpeed = 0.005, orbitSpeed = 0.001, orbitRadius = 0, hasRings = false, ringColor = '#c8b080', ringSize = 1.8, emissive, emissiveIntensity = 0.1 }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const initialPos = useMemo(() => new THREE.Vector3(...position), []);
  const mat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.1 });
    if (texture) { m.map = texture; m.color = new THREE.Color(0xffffff); }
    if (emissive) { m.emissive = new THREE.Color(emissive); m.emissiveIntensity = emissiveIntensity; }
    return m;
  }, [texture, color, emissive, emissiveIntensity]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
      meshRef.current.rotation.x += rotationSpeed * 0.3;
    }
    if (groupRef.current && orbitRadius > 0) {
      const t = state.clock.elapsedTime * orbitSpeed;
      groupRef.current.position.x = initialPos.x + Math.cos(t) * orbitRadius;
      groupRef.current.position.z = initialPos.z + Math.sin(t) * orbitRadius;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {emissive && (
        <mesh>
          <sphereGeometry args={[size * 1.15, 32, 32]} />
          <meshBasicMaterial color={emissive} transparent opacity={0.08} side={THREE.BackSide} />
        </mesh>
      )}
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 64, 64]} />
        <primitive object={mat} />
      </mesh>
      {hasRings && (
        <group rotation={[Math.PI * 0.4, 0, 0]}>
          <mesh>
            <ringGeometry args={[size * 1.4, size * ringSize, 64]} />
            <meshBasicMaterial color={ringColor} transparent opacity={0.25} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          <mesh>
            <ringGeometry args={[size * 1.6, size * ringSize * 0.9, 64]} />
            <meshBasicMaterial color={ringColor} transparent opacity={0.1} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        </group>
      )}
      <pointLight color={emissive || color} intensity={0.5} distance={size * 8} decay={2} />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   SNEAKER3D — low-poly sneaker floating in space
   ═══════════════════════════════════════════════════════ */

interface SneakerProps {
  position: [number, number, number];
  color?: string;
  accent?: string;
  scale?: number;
  rotationSpeed?: number;
  floatSpeed?: number;
  floatHeight?: number;
}

function Sneaker3D({ position, color = '#8b5cf6', accent = '#ec4899', scale = 1, rotationSpeed = 0.5, floatSpeed = 0.8, floatHeight = 0.3 }: SneakerProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const timeOffset = useMemo(() => Math.random() * 100, []);

  const mats = useMemo(() => ({
    sneaker: new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.6 }),
    sole: new THREE.MeshStandardMaterial({ color: '#222222', roughness: 0.8, metalness: 0.1 }),
    accent: new THREE.MeshStandardMaterial({ color: accent, roughness: 0.2, metalness: 0.8, emissive: accent, emissiveIntensity: 0.15 }),
    swoosh: new THREE.MeshStandardMaterial({ color: accent, roughness: 0.1, metalness: 0.9, emissive: accent, emissiveIntensity: 0.25 }),
  }), [color, accent]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime + timeOffset;
    groupRef.current.position.y = position[1] + Math.sin(t * floatSpeed) * floatHeight;
    groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.1;
    groupRef.current.rotation.z = Math.cos(t * 0.3) * 0.08;
    groupRef.current.rotation.y += rotationSpeed * 0.003;
  });

  const s = scale;
  const treadPositions: [number, number, number][] = [[-0.3,-0.31,-0.6],[-0.1,-0.31,-0.6],[0.1,-0.31,-0.6],[0.3,-0.31,-0.6],[-0.3,-0.31,0.6],[-0.1,-0.31,0.6],[0.1,-0.31,0.6],[0.3,-0.31,0.6]];
  const lacePositions: [number, number][] = [[-0.15,0],[0.15,0],[-0.12,0.15],[0.12,0.15],[-0.12,0.3],[0.12,0.3]];
  const eyeletPositions: [number, number, number][] = [[-0.18,0.22,-0.1],[-0.18,0.22,0.05],[-0.18,0.22,0.2],[-0.18,0.22,0.35],[0.18,0.22,-0.1],[0.18,0.22,0.05],[0.18,0.22,0.2],[0.18,0.22,0.35]];

  return (
    <group ref={groupRef} position={position} scale={[s, s, s]}>
      {/* Ground glow */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.06} />
      </mesh>

      <group>
        {/* Sole */}
        <mesh position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.9, 0.12, 1.6]} />
          <primitive object={mats.sole} />
        </mesh>

        {/* Sole tread blocks */}
        {treadPositions.map((p, i) => (
          <mesh key={i} position={p} castShadow>
            <boxGeometry args={[0.08, 0.06, 0.08]} />
            <primitive object={mats.sole} />
          </mesh>
        ))}

        {/* Midsole */}
        <mesh position={[0, -0.15, 0]} castShadow>
          <boxGeometry args={[0.85, 0.08, 1.55]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} metalness={0.1} transparent opacity={0.9} />
        </mesh>

        {/* Upper body */}
        <mesh position={[0, 0.1, 0.1]} castShadow>
          <boxGeometry args={[0.8, 0.35, 1.4]} />
          <primitive object={mats.sneaker} />
        </mesh>

        {/* Toe cap */}
        <mesh position={[0, 0.05, 0.8]} castShadow>
          <boxGeometry args={[0.7, 0.25, 0.25]} />
          <primitive object={mats.sneaker} />
        </mesh>

        {/* Heel cup */}
        <mesh position={[0, 0.15, -0.65]} castShadow>
          <boxGeometry args={[0.75, 0.35, 0.2]} />
          <primitive object={mats.sneaker} />
        </mesh>

        {/* Tongue */}
        <mesh position={[0, 0.32, 0.2]} castShadow>
          <boxGeometry args={[0.4, 0.15, 0.3]} />
          <primitive object={mats.accent} />
        </mesh>

        {/* Ankle collar */}
        <mesh position={[0, 0.32, -0.35]} castShadow>
          <cylinderGeometry args={[0.25, 0.35, 0.15, 12]} />
          <primitive object={mats.accent} />
        </mesh>

        {/* Side swooshes */}
        <mesh position={[0.41, 0.05, 0.1]} rotation={[0, 0, -0.15]} castShadow>
          <boxGeometry args={[0.04, 0.08, 1.0]} />
          <primitive object={mats.swoosh} />
        </mesh>
        <mesh position={[-0.41, 0.05, 0.1]} rotation={[0, 0, 0.15]} castShadow>
          <boxGeometry args={[0.04, 0.08, 1.0]} />
          <primitive object={mats.swoosh} />
        </mesh>

        {/* Lace spheres */}
        {lacePositions.map(([lx, lz], i) => (
          <mesh key={i} position={[lx, 0.28, lz]} castShadow>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.2} />
          </mesh>
        ))}

        {/* Eyelet rings */}
        {eyeletPositions.map((p, i) => (
          <mesh key={`e${i}`} position={p} castShadow>
            <torusGeometry args={[0.05, 0.02, 6, 8]} />
            <meshStandardMaterial color="#cccccc" roughness={0.2} metalness={0.9} />
          </mesh>
        ))}

        {/* Heel tab */}
        <mesh position={[0, 0.25, -0.72]} castShadow>
          <boxGeometry args={[0.3, 0.1, 0.04]} />
          <primitive object={mats.accent} />
        </mesh>
      </group>

      <pointLight color={accent} intensity={0.3} distance={3} decay={2} />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   ASTEROIDS
   ═══════════════════════════════════════════════════════ */

function Asteroids() {
  const ref = useRef<THREE.Group>(null!);
  const debris = useMemo(() => {
    const items: { pos: [number, number, number]; scale: number }[] = [];
    for (let i = 0; i < 40; i++) {
      items.push({
        pos: [(Math.random() - 0.5) * 200, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 200 - 50],
        scale: 0.05 + Math.random() * 0.2,
      });
    }
    return items;
  }, []);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.002;
  });

  return (
    <group ref={ref}>
      {debris.map((d, i) => (
        <mesh key={i} position={d.pos} scale={[d.scale, d.scale, d.scale]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#444444" roughness={0.9} metalness={0.1} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   SCENE LIGHTING
   ═══════════════════════════════════════════════════════ */

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[20, 30, 20]} intensity={1} color="#8b5cf6" />
      <pointLight position={[-20, -10, -30]} intensity={0.5} color="#06b6d4" />
      <pointLight position={[0, -20, 40]} intensity={0.3} color="#ec4899" />
      <directionalLight position={[10, 20, 10]} intensity={0.3} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   NEBULA BACKGROUND
   ═══════════════════════════════════════════════════════ */

function NebulaBackground() {
  return (
    <group>
      <mesh position={[-30, 20, -80]}>
        <sphereGeometry args={[40, 16, 16]} />
        <meshBasicMaterial color="#4a1a6b" transparent opacity={0.04} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[30, -10, -90]}>
        <sphereGeometry args={[35, 16, 16]} />
        <meshBasicMaterial color="#1a3a6b" transparent opacity={0.03} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 30, -100]}>
        <sphereGeometry args={[50, 16, 16]} />
        <meshBasicMaterial color="#0a5a6b" transparent opacity={0.02} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   CAMERA CONTROLLER — auto-rotation
   ═══════════════════════════════════════════════════════ */

function CameraController() {
  const { camera } = useThree();
  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.05;
    camera.position.x = Math.sin(t) * 30;
    camera.position.z = Math.cos(t) * 30;
    camera.position.y = Math.sin(t * 0.5) * 5;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ═══════════════════════════════════════════════════════
   MAIN SCENE COMPOSITION
   ═══════════════════════════════════════════════════════ */

function Scene() {
  return (
    <>
      <SceneLighting />
      <NebulaBackground />
      <CameraController />
      <Stars />
      <Asteroids />

      {/* Gas Giant with rings */}
      <Planet texture={getTextures().gasGiant} size={8} position={[25, 15, -50]} rotationSpeed={0.003} orbitRadius={5} orbitSpeed={0.002} hasRings ringColor="#c8b080" ringSize={2.2} emissive="#f59e0b" emissiveIntensity={0.05} />
      {/* Rocky Planet */}
      <Planet texture={getTextures().rocky} size={4} position={[-20, -8, -40]} rotationSpeed={0.008} orbitRadius={3} orbitSpeed={0.003} emissive="#e08050" emissiveIntensity={0.04} />
      {/* Ice Planet */}
      <Planet texture={getTextures().ice} size={3.5} position={[15, -15, -60]} rotationSpeed={0.006} orbitRadius={4} orbitSpeed={0.0015} emissive="#80c8e8" emissiveIntensity={0.06} />
      {/* Lava Planet */}
      <Planet texture={getTextures().lava} size={2} position={[-30, 12, -35]} rotationSpeed={0.012} emissive="#ff4000" emissiveIntensity={0.08} />
      {/* Tiny distant planet */}
      <Planet size={1.5} position={[5, 25, -70]} rotationSpeed={0.01} color="#6b4a2a" />

      {/* Floating Sneakers */}
      <Sneaker3D position={[-6, 2, 5]} color="#8b5cf6" accent="#ec4899" scale={0.8} rotationSpeed={0.5} floatSpeed={0.7} floatHeight={0.4} />
      <Sneaker3D position={[8, -3, 0]} color="#06b6d4" accent="#f59e0b" scale={0.65} rotationSpeed={0.7} floatSpeed={0.9} floatHeight={0.3} />
      <Sneaker3D position={[-4, -5, -8]} color="#3b82f6" accent="#10b981" scale={0.7} rotationSpeed={0.4} floatSpeed={1.1} floatHeight={0.5} />
      <Sneaker3D position={[5, 6, -4]} color="#f43f5e" accent="#f59e0b" scale={0.6} rotationSpeed={0.6} floatSpeed={0.6} floatHeight={0.35} />
      <Sneaker3D position={[-7, -2, -15]} color="#ec4899" accent="#8b5cf6" scale={0.55} rotationSpeed={0.8} floatSpeed={0.85} floatHeight={0.45} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   EXPORTED COSMIC SCENE
   ═══════════════════════════════════════════════════════ */

export default function CosmicScene() {
  return (
    <div className="fixed inset-0 z-[-1]" aria-hidden="true" style={{ pointerEvents: 'none', background: 'transparent' }}>
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 30], fov: 60, near: 0.1, far: 500 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
          style={{ background: 'transparent', width: '100%', height: '100%' }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
