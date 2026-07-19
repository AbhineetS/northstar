import React from 'react';
import * as THREE from 'three';
import { PITCH_WIDTH } from './constants';

const goalWidth = 7.32;
const goalHeight = 2.44;

const GoalStructure: React.FC<{ position: [number, number, number], rotation: [number, number, number] }> = ({ position, rotation }) => {
  const mat = React.useMemo(() => new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.2, roughness: 0.1 }), []);
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, goalHeight/2, 0]} castShadow><cylinderGeometry args={[0.08, 0.08, goalHeight]} /><primitive object={mat} attach="material" /></mesh>
      <mesh position={[0, goalHeight/2, goalWidth]} castShadow><cylinderGeometry args={[0.08, 0.08, goalHeight]} /><primitive object={mat} attach="material" /></mesh>
      <mesh position={[0, goalHeight, goalWidth/2]} rotation={[Math.PI/2, 0, 0]} castShadow><cylinderGeometry args={[0.08, 0.08, goalWidth]} /><primitive object={mat} attach="material" /></mesh>
    </group>
  );
};

export const Goals: React.FC = () => {
  return (
    <group>
      <GoalStructure position={[-PITCH_WIDTH/2, 0, -goalWidth/2]} rotation={[0, 0, 0]} />
      <GoalStructure position={[PITCH_WIDTH/2, 0, goalWidth/2]} rotation={[0, Math.PI, 0]} />
    </group>
  );
};
