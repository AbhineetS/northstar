import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export const CameraSetup: React.FC = () => {
  const { size, camera } = useThree();
  useEffect(() => {
    if (camera.type === 'OrthographicCamera') {
      const aspect = size.width / size.height;
      const frustumSize = 68;
      const orthCam = camera as THREE.OrthographicCamera;
      Object.assign(orthCam, {
        left: -frustumSize * aspect / 2,
        right: frustumSize * aspect / 2,
        top: frustumSize / 2,
        bottom: -frustumSize / 2
      });
      orthCam.updateProjectionMatrix();
    }
  }, [size, camera]);
  return null;
};
