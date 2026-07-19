import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StaffMap } from '../StaffMap';
import { useTelemetryStore } from '@/store/useTelemetryStore';

// Mock map components
vi.mock('@/components/map/MapContainer', () => ({
  MapContainer: ({ children }: { children?: React.ReactNode }) => <div data-testid="map-container">{children}</div>
}));
vi.mock('react-map-gl/maplibre', () => ({
  Marker: ({ children }: { children?: React.ReactNode }) => <div data-testid="marker">{children}</div>,
  Source: ({ children }: { children?: React.ReactNode }) => <div data-testid="source">{children}</div>,
  Layer: () => <div data-testid="layer" />,
  useMap: () => ({ current: { flyTo: vi.fn() } })
}));

describe('StaffMap', () => {
  it('renders correctly with no incidents', () => {
    useTelemetryStore.setState({ incidents: [] });
    render(<StaffMap />);
    
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.getByText('Zone 4 (East)')).toBeInTheDocument();
    expect(screen.getByText('0 Alerts')).toBeInTheDocument();
    expect(screen.queryByText('Priority Escalation Route')).not.toBeInTheDocument();
  });

  it('renders routing information with active incidents', () => {
    useTelemetryStore.setState({ 
      incidents: [
        {
          id: 'inc-1',
          type: 'Medical',
          location: 'Gate 4',
          description: 'Minor injury',
          status: 'Active',
          timeActiveMinutes: 5,
          lat: 40.7135,
          lng: -74.0068,
          severity: 'medium'
        }
      ] 
    });
    
    render(<StaffMap />);
    
    expect(screen.getByText('1 Alerts')).toBeInTheDocument();
    expect(screen.getByText('Priority Escalation Route')).toBeInTheDocument();
    expect(screen.getByText('Medical Incident')).toBeInTheDocument(); // Map overlay incident marker
  });
});
