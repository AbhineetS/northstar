/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { HeatmapLayer } from '../HeatmapLayer';

describe('HeatmapLayer', () => {
  it('renders without crashing', () => {
    const { container } = render(<HeatmapLayer data={[]} />);
    expect(container).toBeTruthy();
  });
});
