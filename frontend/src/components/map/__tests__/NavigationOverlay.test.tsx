/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { NavigationOverlay } from '../NavigationOverlay';

vi.mock('react-map-gl', () => ({
  Source: ({ children }: any) => <div data-testid="map-source">{children}</div>,
  Layer: () => <div data-testid="map-layer" />
}));

describe('NavigationOverlay', () => {
  it('renders correctly', () => {
    const { container } = render(
      <NavigationOverlay origin={{lat:0, lng:0}} destination={{lat:1, lng:1}} />
    );
    expect(container).toBeTruthy();
  });
  
  it('renders with origin and destination', () => {
    const { container } = render(<NavigationOverlay origin={{lat:0, lng:0}} destination={{lat:1, lng:1}} />);
    expect(container).toBeTruthy();
  });
});
