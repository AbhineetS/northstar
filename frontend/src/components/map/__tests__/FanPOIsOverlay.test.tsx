 
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { FanPOIsOverlay } from '../FanPOIsOverlay';

describe('FanPOIsOverlay', () => {
  it('renders without crashing', () => {
    const { container } = render(<FanPOIsOverlay />);
    expect(container).toBeTruthy();
  });
});
