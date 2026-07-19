import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VolunteerHome } from '../VolunteerHome';
import { useTelemetryStore } from '@/store/useTelemetryStore';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => <div {...props}>{children}</div>,
    circle: ({ ...props }: Record<string, unknown>) => <circle {...props} />
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>
}));

describe('VolunteerHome', () => {
  it('renders correctly with no incidents', () => {
    useTelemetryStore.setState({ incidents: [] });
    render(<VolunteerHome />);
    
    expect(screen.getByText('Zone A')).toBeInTheDocument();
    expect(screen.getByText('Global Comms')).toBeInTheDocument();
    expect(screen.getByText('AI Insight')).toBeInTheDocument();
    expect(screen.getByText('Zone Clear')).toBeInTheDocument();
  });

  it('renders active incidents', () => {
    useTelemetryStore.setState({ 
      incidents: [
        {
          id: 'inc-1',
          type: 'Medical',
          location: 'Gate 4',
          description: 'Minor injury',
          status: 'Active',
          timeActiveMinutes: 5,
          lat: 0,
          lng: 0,
          severity: 'medium'
        }
      ] 
    });
    
    render(<VolunteerHome />);
    
    expect(screen.getByText('1 Active')).toBeInTheDocument();
    expect(screen.getByText('Medical Emergency')).toBeInTheDocument();
    expect(screen.getByText('Minor injury')).toBeInTheDocument();
    expect(screen.getByText('Gate 4')).toBeInTheDocument();
  });
});
