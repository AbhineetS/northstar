import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CameraSetup } from '../CameraSetup';
import { CrispLines } from '../CrispLines';
import { Goals } from '../Goals';
import { GrassPlane } from '../GrassPlane';
import { PlayersAndBall } from '../PlayersAndBall';

// Mock react-three/fiber and react-three/drei
vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
  useThree: () => ({ camera: {}, gl: { domElement: {} } }),
  Canvas: ({ children }: { children?: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
  extend: vi.fn()
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  Line: () => <div data-testid="line" />,
  Sphere: ({ children }: { children?: React.ReactNode }) => <div data-testid="sphere">{children}</div>,
  Circle: ({ children }: { children?: React.ReactNode }) => <div data-testid="circle">{children}</div>,
  Cylinder: ({ children }: { children?: React.ReactNode }) => <div data-testid="cylinder">{children}</div>,
  shaderMaterial: vi.fn(() => 'shaderMaterial'),
}));

describe('Pitch Components', () => {
  it('renders CameraSetup without crashing', () => {
    const { container } = render(<CameraSetup />);
    expect(container).toBeInTheDocument();
  });

  it('renders CrispLines without crashing', () => {
    const { container } = render(<CrispLines />);
    expect(container).toBeInTheDocument();
  });

  it('renders Goals without crashing', () => {
    const { container } = render(<Goals />);
    expect(container).toBeInTheDocument();
  });

  it('renders GrassPlane without crashing', () => {
    const { container } = render(<GrassPlane />);
    expect(container).toBeInTheDocument();
  });

  it('renders PlayersAndBall without crashing', () => {
    const { container } = render(<PlayersAndBall />);
    expect(container).toBeInTheDocument();
  });
});
