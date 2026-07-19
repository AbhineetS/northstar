 
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HeatmapLayer } from '../HeatmapLayer';

describe('HeatmapLayer', () => {
  it('renders without crashing', () => {
    const { container } = render(<HeatmapLayer data={[]} />);
    expect(container).toBeTruthy();
  });
});
