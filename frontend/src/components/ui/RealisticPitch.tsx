'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { GrassPlane } from './pitch/GrassPlane';
import { CrispLines } from './pitch/CrispLines';
import { Goals } from './pitch/Goals';
import { PlayersAndBall } from './pitch/PlayersAndBall';
import { CameraSetup } from './pitch/CameraSetup';

export const RealisticPitch: React.FC = () => {
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
