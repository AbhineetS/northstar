import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StadiumMapWidget } from '../StadiumMapWidget';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>
}));

vi.mock('@/services/VenueConfig', () => ({
  VENUE_FOOD_VENDORS: [
    { name: 'Burger Bar', location: 'Section 102', queueTimeMinutes: 8 },
    { name: 'Taco Stand', location: 'Gate C', queueTimeMinutes: 3 },
  ],
  VENUE_WASHROOMS: [
    { gender: 'Male', location: 'Level 1 Concourse', distanceMeters: 45 },
    { gender: 'Female', location: 'Level 1 Concourse', distanceMeters: 50 },
  ],
}));

describe('StadiumMapWidget', () => {
  it('renders without crashing', () => {
    const { container } = render(<StadiumMapWidget gate='A' section='100' seat='1' />);
    expect(container).toBeInTheDocument();
  });

  it('shows Interactive Stadium heading', () => {
    render(<StadiumMapWidget gate='A' section='107' seat='23' />);
    expect(screen.getByRole('heading', { name: /interactive stadium/i })).toBeInTheDocument();
  });

  it('shows gate info in seat journey view by default', () => {
    render(<StadiumMapWidget gate='A' section='107' seat='23' />);
    expect(screen.getByText(/Enter A/i)).toBeInTheDocument();
    expect(screen.getByText(/Proceed to 107/i)).toBeInTheDocument();
  });

  it('renders filter tabs with correct aria-labels', () => {
    render(<StadiumMapWidget gate='A' section='100' seat='1' />);
    expect(screen.getByRole('button', { name: /filter by food/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /filter by merch/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /filter by restrooms/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /filter by exits/i })).toBeInTheDocument();
  });

  it('switches to Food filter and shows food vendors', () => {
    render(<StadiumMapWidget gate='A' section='100' seat='1' />);
    fireEvent.click(screen.getByRole('button', { name: /filter by food/i }));
    expect(screen.getByText('Burger Bar')).toBeInTheDocument();
    expect(screen.getByText('Taco Stand')).toBeInTheDocument();
  });

  it('shows queue times in food view', () => {
    render(<StadiumMapWidget gate='A' section='100' seat='1' />);
    fireEvent.click(screen.getByRole('button', { name: /filter by food/i }));
    expect(screen.getByText(/8m wait/i)).toBeInTheDocument();
  });

  it('switches to Restrooms filter', () => {
    render(<StadiumMapWidget gate='A' section='100' seat='1' />);
    fireEvent.click(screen.getByRole('button', { name: /filter by restrooms/i }));
    expect(screen.getAllByText(/Male Restroom/i).length).toBeGreaterThan(0);
  });

  it('switches to Merch filter', () => {
    render(<StadiumMapWidget gate='A' section='100' seat='1' />);
    fireEvent.click(screen.getByRole('button', { name: /filter by merch/i }));
    expect(screen.getByText(/Main Team Store/i)).toBeInTheDocument();
  });

  it('shows emergency exits when Exits filter is clicked', () => {
    render(<StadiumMapWidget gate='A' section='100' seat='1' />);
    fireEvent.click(screen.getByRole('button', { name: /filter by exits/i }));
    expect(screen.getByText(/Exit Alpha/i)).toBeInTheDocument();
    // Multiple exits may have 'Clear' status
    expect(screen.getAllByText(/Clear/i).length).toBeGreaterThan(0);
  });
});
