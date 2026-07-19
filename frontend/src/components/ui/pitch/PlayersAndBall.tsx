import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PITCH_WIDTH, PITCH_LENGTH, PLAYER_COUNT } from './constants';

export const PlayersAndBall: React.FC = () => {
  const playersRef = useRef<THREE.Group>(null);
  const ballRef = useRef<THREE.Mesh>(null);
  
  const initialData = useMemo(() => {
    const data = [];
    for(let i = 0; i < PLAYER_COUNT; i++) {
      const isRed = i < PLAYER_COUNT / 2;
      /* eslint-disable react-hooks/purity */
      const x = (Math.random() - 0.5) * (PITCH_WIDTH * 0.8) + (isRed ? -15 : 15);
      const z = (Math.random() - 0.5) * (PITCH_LENGTH * 0.8);
      data.push({
        baseX: x, baseZ: z,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.5 + 0.2,
        isRed
      });
      /* eslint-enable react-hooks/purity */
    }
    return data;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (playersRef.current) {
      playersRef.current.children.forEach((player, i) => {
        const d = initialData[i];
        const targetX = d.baseX + Math.sin(time * d.speed + d.phase) * 10;
        const targetZ = d.baseZ + Math.cos(time * d.speed * 0.8 + d.phase) * 8;
        
        player.position.x += (targetX - player.position.x) * 0.02;
        player.position.z += (targetZ - player.position.z) * 0.02;
      });
    }

    if (ballRef.current && playersRef.current) {
      const targetPlayerIndex = Math.floor(time / 4) % 2 === 0 ? 0 : 12;
      const targetPlayer = playersRef.current.children[targetPlayerIndex];
      if (targetPlayer) {
        ballRef.current.position.x += (targetPlayer.position.x - ballRef.current.position.x) * 0.05;
        ballRef.current.position.z += (targetPlayer.position.z - ballRef.current.position.z) * 0.05;
        ballRef.current.position.y = 0.8 + Math.abs(Math.sin(time * 6)) * 1.5;
      }
    }
  });

  return (
    <group>
      <group ref={playersRef}>
        {initialData.map((d, i) => (
          <group key={i} position={[d.baseX, 0, d.baseZ]}>
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
      <mesh ref={ballRef} position={[0, 0.6, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.1} />
      </mesh>
    </group>
  );
};
