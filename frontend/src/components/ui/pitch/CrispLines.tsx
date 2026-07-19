import React from 'react';
import * as THREE from 'three';
import { PITCH_WIDTH, PITCH_LENGTH } from './constants';

export const CrispLines: React.FC = () => {
  const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2, transparent: true, opacity: 0.9 });
  
  const w = PITCH_WIDTH / 2;
  const h = PITCH_LENGTH / 2;
  
  const outlineGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-w, 0, -h), new THREE.Vector3(w, 0, -h),
    new THREE.Vector3(w, 0, h), new THREE.Vector3(-w, 0, h),
    new THREE.Vector3(-w, 0, -h)
  ]);

  const halfwayGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, -h), new THREE.Vector3(0, 0, h)
  ]);

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
      
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[9.15, 9.35, 64]} />
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} transparent opacity={0.9} />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 32]} />
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};
