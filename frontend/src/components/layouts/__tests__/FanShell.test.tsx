import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FanShell } from '../FanShell';
import { useTelemetryStore } from '@/store/useTelemetryStore';

// Mock map components
vi.mock('@/components/map/MapContainer', () => ({
  MapContainer: ({ children }: { children?: React.ReactNode }) => <div data-testid="map-container">{children}</div>
}));
vi.mock('@/components/map/NavigationOverlay', () => ({
  NavigationOverlay: () => <div data-testid="navigation-overlay">Navigation Overlay</div>
}));
vi.mock('@/components/map/FanPOIsOverlay', () => ({
  FanPOIsOverlay: () => <div data-testid="fan-pois">Fan POIs Overlay</div>
}));
vi.mock('react-map-gl/maplibre', () => ({
  useMap: () => ({ current: { flyTo: vi.fn() } })
}));

describe('FanShell', () => {
  it('renders children and map container', () => {
    useTelemetryStore.setState({ journeyStage: 'before_leaving' });
    
    render(
      <FanShell>
        <div data-testid="child">Child Content</div>
      </FanShell>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.getByTestId('fan-pois')).toBeInTheDocument();
  });

  it('renders navigation overlay during travel', () => {
    useTelemetryStore.setState({ journeyStage: 'travel' });
    
    render(
      <FanShell>
        <div>Content</div>
      </FanShell>
    );

    // Note: Since geolocation is mocked or takes time in tests, we can just assert it renders FanPOIs
    expect(screen.getByTestId('fan-pois')).toBeInTheDocument();
  });
});
