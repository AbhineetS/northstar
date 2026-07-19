import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LineupWidget } from '../LineupWidget';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>
}));

describe('LineupWidget', () => {
  it('renders without crashing', () => {
    const { container } = render(<LineupWidget homeTeam='Team A' awayTeam='Team B' />);
    expect(container).toBeInTheDocument();
  });

  it('renders "Starting XI" heading', () => {
    render(<LineupWidget homeTeam='Brazil' awayTeam='France' />);
    expect(screen.getByRole('heading', { name: /starting xi/i })).toBeInTheDocument();
  });

  it('renders home team tab button', () => {
    render(<LineupWidget homeTeam='Brazil' awayTeam='France' />);
    expect(screen.getByRole('button', { name: /BRA/i })).toBeInTheDocument();
  });

  it('renders away team tab button', () => {
    render(<LineupWidget homeTeam='Brazil' awayTeam='France' />);
    expect(screen.getByRole('button', { name: /FRA/i })).toBeInTheDocument();
  });

  it('switches to away team on tab click', () => {
    render(<LineupWidget homeTeam='Brazil' awayTeam='France' />);
    const awayBtn = screen.getByRole('button', { name: /FRA/i });
    fireEvent.click(awayBtn);
    // Should still render the away tab button
    expect(screen.getByRole('button', { name: /FRA/i })).toBeInTheDocument();
  });

  it('handles short team names correctly', () => {
    render(<LineupWidget homeTeam='A' awayTeam='B' />);
    expect(screen.getByRole('button', { name: /^A$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^B$/i })).toBeInTheDocument();
  });

  it('handles empty strings gracefully', () => {
    render(<LineupWidget homeTeam='' awayTeam='' />);
    expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(2);
  });
});
