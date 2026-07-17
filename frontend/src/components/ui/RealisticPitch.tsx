/* eslint-disable */
'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { shaderMaterial } from '@react-three/drei';

const PITCH_WIDTH = 105;
const PITCH_LENGTH = 68;
const PLAYER_COUNT = 22;

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
    // Subtle wind sway (optional, but keeps it from being completely dead)
    vec2 wind = vec2(sin(uTime * 0.5 + vWorldPos.x * 0.1), cos(uTime * 0.5 + vWorldPos.z * 0.1)) * 0.0005;
    
    // Distort UVs slightly by wind (no mouse interaction)
    vec2 distortedUv = vUv + wind;

    // 2. Base Pitch Stripes
    float stripe = step(0.5, fract(distortedUv.x * 36.0));
    vec3 color = mix(uColor1, uColor2, stripe);
    
    // 3. Proper Grass Texture (Fiber-like noise)
    // Scale X and Y differently to make short blades/fibers
    float grassFibers = fbm(distortedUv * vec2(4000.0, 4000.0));
    float grassDetail = rand(distortedUv * 8000.0);
    
    // Blend fibers into color
    color -= (grassFibers * 0.15);
    color -= (grassDetail * 0.05);

    gl_FragColor = vec4(color, 1.0);
  }
  `
);
extend({ GrassMaterial });

const GrassPlane = () => {
  const materialRef = useRef<any>(null);
  const [mousePos] = useState(() => new THREE.Vector2(-1000, -1000));
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
      // Convert normalized screen mouse to world coordinates
      // With OrthographicCamera, height is perfectly matched to frustum height
      const aspect = state.viewport.aspect;
      mousePos.set(state.pointer.x * (34 * aspect), -state.pointer.y * 34);
      materialRef.current.uMouse = mousePos;
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.02, 0]}>
      <planeGeometry args={[PITCH_WIDTH * 2, PITCH_WIDTH * 2]} />
      {/* @ts-ignore */}
      <grassMaterial ref={materialRef} transparent={false} />
    </mesh>
  );
};

const CrispLines = () => {
  const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2, transparent: true, opacity: 0.9 });
  
  // Field Dimensions
  const w = PITCH_WIDTH / 2;
  const h = PITCH_LENGTH / 2;
  
  // Outline
  const outlineGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-w, 0, -h), new THREE.Vector3(w, 0, -h),
    new THREE.Vector3(w, 0, h), new THREE.Vector3(-w, 0, h),
    new THREE.Vector3(-w, 0, -h)
  ]);

  // Halfway
  const halfwayGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, -h), new THREE.Vector3(0, 0, h)
  ]);

  // Penalty Boxes (16.5m deep, 40.3m wide)
  const pbW = 40.3 / 2;
  const pbD = 16.5;
  const pBox1Geo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-w, 0, -pbW), new THREE.Vector3(-w + pbD, 0, -pbW),
    new THREE.Vector3(-w + pbD, 0, pbW), new THREE.Vector3(-w, 0, pbW)
  ]);
  const pBox2Geo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(w, 0, -pbW), new THREE.Vector3(w - pbD, 0, -pbW),
    new THREE.Vector3(w - pbD, 0, pbW), new THREE.Vector3(w, 0, pbW)
  ]);

  // Goal Boxes (5.5m deep, 18.32m wide)
  const gbW = 18.32 / 2;
  const gbD = 5.5;
  const gBox1Geo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-w, 0, -gbW), new THREE.Vector3(-w + gbD, 0, -gbW),
    new THREE.Vector3(-w + gbD, 0, gbW), new THREE.Vector3(-w, 0, gbW)
  ]);
  const gBox2Geo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(w, 0, -gbW), new THREE.Vector3(w - gbD, 0, -gbW),
    new THREE.Vector3(w - gbD, 0, gbW), new THREE.Vector3(w, 0, gbW)
  ]);

  return (
    <group position={[0, 0.01, 0]}>
      <primitive object={new THREE.Line(outlineGeo, lineMat)} />
      <primitive object={new THREE.Line(halfwayGeo, lineMat)} />
      <primitive object={new THREE.Line(pBox1Geo, lineMat)} />
      <primitive object={new THREE.Line(pBox2Geo, lineMat)} />
      <primitive object={new THREE.Line(gBox1Geo, lineMat)} />
      <primitive object={new THREE.Line(gBox2Geo, lineMat)} />
      
      {/* Center Circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[9.15, 9.35, 64]} />
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} transparent opacity={0.9} />
      </mesh>
      
      {/* Center Spot */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 32]} />
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const Goals = () => {
  const goalWidth = 7.32;
  const goalDepth = 2;
  const goalHeight = 2.44;
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.2, roughness: 0.1 });
  
  const GoalStructure = ({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) => (
    <group position={position} rotation={rotation}>
      <mesh position={[0, goalHeight/2, 0]} castShadow><cylinderGeometry args={[0.08, 0.08, goalHeight]} /><primitive object={mat} attach="material" /></mesh>
      <mesh position={[0, goalHeight/2, goalWidth]} castShadow><cylinderGeometry args={[0.08, 0.08, goalHeight]} /><primitive object={mat} attach="material" /></mesh>
      <mesh position={[0, goalHeight, goalWidth/2]} rotation={[Math.PI/2, 0, 0]} castShadow><cylinderGeometry args={[0.08, 0.08, goalWidth]} /><primitive object={mat} attach="material" /></mesh>
    </group>
  );

  return (
    <group>
      <GoalStructure position={[-PITCH_WIDTH/2, 0, -goalWidth/2]} rotation={[0, 0, 0]} />
      <GoalStructure position={[PITCH_WIDTH/2, 0, goalWidth/2]} rotation={[0, Math.PI, 0]} />
    </group>
  );
};

const PlayersAndBall = () => {
  const playersRef = useRef<THREE.Group>(null);
  const ballRef = useRef<THREE.Mesh>(null);
  
  // Initialize deterministic target positions
  const initialData = useMemo(() => {
    const data = [];
    for(let i = 0; i < PLAYER_COUNT; i++) {
      const isRed = i < PLAYER_COUNT / 2;
      const x = (Math.random() - 0.5) * (PITCH_WIDTH * 0.8) + (isRed ? -15 : 15);
      const z = (Math.random() - 0.5) * (PITCH_LENGTH * 0.8);
      data.push({
        baseX: x, baseZ: z,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.5 + 0.2,
        isRed
      });
    }
    return data;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Animate Players
    if (playersRef.current) {
      playersRef.current.children.forEach((player, i) => {
        const d = initialData[i];
        const targetX = d.baseX + Math.sin(time * d.speed + d.phase) * 10;
        const targetZ = d.baseZ + Math.cos(time * d.speed * 0.8 + d.phase) * 8;
        
        // Very smooth interpolation
        player.position.x += (targetX - player.position.x) * 0.02;
        player.position.z += (targetZ - player.position.z) * 0.02;
      });
    }

    // Animate Ball
    if (ballRef.current && playersRef.current) {
      // Ball loosely follows player 0, then player 12 (passing simulation)
      const targetPlayerIndex = Math.floor(time / 4) % 2 === 0 ? 0 : 12;
      const targetPlayer = playersRef.current.children[targetPlayerIndex];
      if (targetPlayer) {
        ballRef.current.position.x += (targetPlayer.position.x - ballRef.current.position.x) * 0.05;
        ballRef.current.position.z += (targetPlayer.position.z - ballRef.current.position.z) * 0.05;
        // Bounce effect
        ballRef.current.position.y = 0.8 + Math.abs(Math.sin(time * 6)) * 1.5;
      }
    }
  });

  return (
    <group>
      <group ref={playersRef}>
        {initialData.map((d, i) => (
          <group key={i} position={[d.baseX, 0, d.baseZ]}>
            {/* Premium Capsule Pieces (Enlarged for visibility) */}
            <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
              <capsuleGeometry args={[0.5, 1.2, 16, 16]} />
              <meshPhysicalMaterial 
                color={d.isRed ? '#bd1f2b' : '#1f48bd'} 
                metalness={0.2} 
                roughness={0.1}
                clearcoat={1}
                clearcoatRoughness={0.1}
              />
            </mesh>
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI/2, 0, 0]}>
              <ringGeometry args={[0.6, 0.8, 32]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
            </mesh>
          </group>
        ))}
      </group>
      {/* Football (Enlarged for top-down visibility) */}
      <mesh ref={ballRef} position={[0, 0.6, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.1} />
      </mesh>
    </group>
  );
};

const CameraSetup = () => {
  const { size, camera } = useThree();
  useEffect(() => {
    if (camera.type === 'OrthographicCamera') {
      const aspect = size.width / size.height;
      const frustumSize = 68; // Exact pitch width
      const orthCam = camera as THREE.OrthographicCamera;
      orthCam.left = -frustumSize * aspect / 2;
      orthCam.right = frustumSize * aspect / 2;
      orthCam.top = frustumSize / 2;
      orthCam.bottom = -frustumSize / 2;
      orthCam.updateProjectionMatrix();
    }
  }, [size, camera]);
  return null;
};

export const RealisticPitch = () => {
  return (
    <div className="absolute inset-0 w-full h-full z-0 bg-[#65c952]">
      <Canvas shadows orthographic camera={{ position: [0, 100, 0], near: 0.1, far: 1000, rotation: [-Math.PI / 2, 0, 0] }}>
        <CameraSetup />
        <fog attach="fog" args={['#65c952', 120, 250]} />
        <ambientLight intensity={1.8} color="#ffffff" />
        <directionalLight 
          position={[-20, 100, -20]} 
          intensity={1.2} 
          castShadow 
          color="#ffffff"
          shadow-mapSize-width={2048} 
          shadow-mapSize-height={2048}
          shadow-camera-far={200}
          shadow-camera-left={-80}
          shadow-camera-right={80}
          shadow-camera-top={80}
          shadow-camera-bottom={-80}
        />
        <GrassPlane />
        <CrispLines />
        <Goals />
        <PlayersAndBall />
        <EffectComposer>
          <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.9} intensity={0.6} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
