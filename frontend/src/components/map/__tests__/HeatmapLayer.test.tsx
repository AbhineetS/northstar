/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { HeatmapLayer } from '../HeatmapLayer';

vi.mock('react-map-gl', () => ({
  Source: ({ children }: any) => <div data-testid="map-source">{children}</div>,
  Layer: () => <div data-testid="map-layer" />
}));

describe('HeatmapLayer', () => {
  it('renders without crashing', () => {
    const { container } = render(<HeatmapLayer data={[]} />);
    expect(container).toBeTruthy();
  });
});
