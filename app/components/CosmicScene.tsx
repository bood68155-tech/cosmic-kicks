'use client';
import * as React from 'react';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const TEXTURES = {};

// Stars particle system
function Stars() {
  const ref = useRef(null);
  const count = 3000;
  const data = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const bSz = new Float32Array(count);
    const spd = new Float32Array(count);
    const off = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 50 + Math.random() * 150;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i*3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i*3+1] = r * Math.cos(phi);
      pos[i*3+2] = r * Math.sin(phi) * Math.sin(theta);
      const bright = 0.6 + Math.random() * 0.4;
      col[i*3] = bright; col[i*3+1] = bright; col[i*3+2] = bright;
      bSz[i] = 0.3 + Math.random() * 1.8;
      spd[i] = 0.5 + Math.random() * 2.5;
      off[i] = Math.random() * Math.PI * 2;
    }
    return { pos, col, bSz, spd, off };
  }, []);
  
  const sizes = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) arr[i] = data.bSz[i];
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const geom = ref.current.geometry;
    let attr = geom.attributes.size;
    if (!attr) { geom.setAttribute('size', new THREE.BufferAttribute(sizes, 1)); attr = geom.attributes.size; }
    const arr = attr.array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const tw = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * data.spd[i] + data.off[i]));
      arr[i] = data.bSz[i] * tw;
    }
    attr.needsUpdate = true;
    ref.current.rotation.y = t * 0.005;
    ref.current.rotation.x = Math.sin(t * 0.002) * 0.1;
  });

  return React.createElement('points', { ref },
    React.createElement('bufferGeometry', null,
      React.createElement('float32BufferAttribute', { attach: 'attributes-position', args: [data.pos, 3] }),
      React.createElement('float32BufferAttribute', { attach: 'attributes-color', args: [data.col, 3] }),
      React.createElement('float32BufferAttribute', { attach: 'attributes-size', args: [sizes, 1] })
    ),
    React.createElement('pointsMaterial', { size: 1.5, vertexColors: true, transparent: true, opacity: 0.9, sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false })
  );
}

// Planet component
function Planet({ texture, color = '#8a6a30', size, position, rotationSpeed = 0.005, orbitSpeed = 0.001, orbitRadius = 0, hasRings = false, ringColor = '#c8b080', ringSize = 1.8, emissive, emissiveIntensity = 0.1 }) {
  const meshRef = useRef(null);
  const groupRef = useRef(null);
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

  return React.createElement('group', { ref: groupRef, position },
    emissive && React.createElement('mesh', null, React.createElement('sphereGeometry', { args: [size * 1.15, 32, 32] }), React.createElement('meshBasicMaterial', { color: emissive, transparent: true, opacity: 0.08, side: THREE.BackSide })),
    React.createElement('mesh', { ref: meshRef }, React.createElement('sphereGeometry', { args: [size, 64, 64] }), React.createElement('primitive', { object: mat })),
    hasRings && React.createElement('group', { rotation: [Math.PI * 0.4, 0, 0] },
      React.createElement('mesh', null, React.createElement('ringGeometry', { args: [size * 1.4, size * ringSize, 64] }), React.createElement('meshBasicMaterial', { color: ringColor, transparent: true, opacity: 0.25, side: THREE.DoubleSide, depthWrite: false })),
      React.createElement('mesh', null, React.createElement('ringGeometry', { args: [size * 1.6, size * ringSize * 0.9, 64] }), React.createElement('meshBasicMaterial', { color: ringColor, transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false }))
    ),
    React.createElement('pointLight', { color: emissive || color, intensity: 0.5, distance: size * 8, decay: 2 })
  );
}

// Export placeholder - will be properly written next
export default function CosmicScene() {
  return React.createElement('div', { className: 'fixed inset-0 z-[-1]', 'aria-hidden': 'true', style: { pointerEvents: 'none', background: 'transparent' } },
    React.createElement(Suspense, { fallback: null },
      React.createElement(Canvas, { camera: { position: [0,0,30], fov: 60, near: 0.1, far: 500 }, gl: { antialias: true, alpha: true, powerPreference: 'high-performance' }, dpr: [1, 1.5], style: { background: 'transparent', width: '100%', height: '100%' } },
        'Scene will be rendered here'
      )
    )
  );
}