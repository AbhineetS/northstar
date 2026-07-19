/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WeatherImpactWidget, ResourceStatusWidget } from '../OpsWidgets';
import { useTelemetryStore } from '@/store/useTelemetryStore';

vi.mock('@/store/useTelemetryStore', () => ({
  useTelemetryStore: vi.fn(),
}));

describe('OpsWidgets', () => {
  it('renders WeatherImpactWidget', () => {
    (useTelemetryStore as any).mockReturnValue({
      weather: { condition: 'rain', temperature_c: 20 },
    });
    render(<WeatherImpactWidget />);
    expect(screen.getByText('Meteorological')).toBeInTheDocument();
  });

  it('renders ResourceStatusWidget', () => {
    render(<ResourceStatusWidget />);
    expect(screen.getByText('Active Resources')).toBeInTheDocument();
  });
});
