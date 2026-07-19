import React, { useRef, useState } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { PITCH_WIDTH } from './constants';

const GrassMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(-1000, -1000),
    uColor1: new THREE.Color('#65c952'),
    uColor2: new THREE.Color('#78d666'),
  },
  // vertex shader
  `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
  `,
  // fragment shader
  `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec3 uColor1;
  uniform vec3 uColor2;

  varying vec2 vUv;
  varying vec3 vWorldPos;

  // Simple random
  float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }
  
  // 2D Noise
  float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);
    float res = mix(
      mix(rand(ip), rand(ip+vec2(1.0,0.0)), u.x),
      mix(rand(ip+vec2(0.0,1.0)), rand(ip+vec2(1.0,1.0)), u.x), u.y);
    return res*res;
  }

  // Fractal Brownian Motion for rich grass texture
  float fbm(vec2 p) {
    float f = 0.0;
    float w = 0.5;
    for(int i = 0; i < 4; i++) {
      f += w * noise(p);
      p *= 2.0;
      w *= 0.5;
    }
    return f;
  }

  void main() {
    // Subtle wind sway
    vec2 wind = vec2(sin(uTime * 0.5 + vWorldPos.x * 0.1), cos(uTime * 0.5 + vWorldPos.z * 0.1)) * 0.0005;
    
    // Distort UVs slightly by wind
    vec2 distortedUv = vUv + wind;

    // 2. Base Pitch Stripes
    float stripe = step(0.5, fract(distortedUv.x * 36.0));
    vec3 color = mix(uColor1, uColor2, stripe);
    
    // 3. Proper Grass Texture
    float grassFibers = fbm(distortedUv * vec2(4000.0, 4000.0));
    float grassDetail = rand(distortedUv * 8000.0);
    
    color -= (grassFibers * 0.15);
    color -= (grassDetail * 0.05);

    gl_FragColor = vec4(color, 1.0);
  }
  `
);
extend({ GrassMaterial });

export const GrassPlane: React.FC = () => {
  const materialRef = useRef<THREE.ShaderMaterial & { uTime: number; uMouse: THREE.Vector2 }>(null);
  const [mousePos] = useState(() => new THREE.Vector2(-1000, -1000));
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
      const aspect = state.viewport.aspect;
      mousePos.set(state.pointer.x * (34 * aspect), -state.pointer.y * 34);
      materialRef.current.uMouse = mousePos;
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.02, 0]}>
      <planeGeometry args={[PITCH_WIDTH * 2, PITCH_WIDTH * 2]} />
      {/* @ts-expect-error - Custom material type in JSX is not recognized */}
      <grassMaterial ref={materialRef} transparent={false} />
    </mesh>
  );
};
