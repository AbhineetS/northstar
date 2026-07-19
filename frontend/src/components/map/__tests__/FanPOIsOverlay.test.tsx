/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { FanPOIsOverlay } from '../FanPOIsOverlay';

describe('FanPOIsOverlay', () => {
  it('renders without crashing', () => {
    const { container } = render(<FanPOIsOverlay />);
    expect(container).toBeTruthy();
  });
});
