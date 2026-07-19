import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MatchCenterTab } from '../MatchCenterTab';
import { ILiveMatchStats } from '@/services/interfaces';

describe('MatchCenterTab', () => {
  const mockLiveMatchBase = {
    isLoading: false,
    error: null,
    retry: vi.fn(),
    isEmpty: false,
  };

  it('renders loading state', () => {
    render(<MatchCenterTab liveMatch={{ ...mockLiveMatchBase, isLoading: true, data: null }} />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    render(<MatchCenterTab liveMatch={{ ...mockLiveMatchBase, error: new Error('Failed'), data: null }} />);
    expect(screen.getByText('Connection Error')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(<MatchCenterTab liveMatch={{ ...mockLiveMatchBase, isEmpty: true, data: null }} />);
    expect(screen.getByText('No data available.')).toBeInTheDocument();
  });

  it('renders match data correctly when Live', () => {
    const mockData: ILiveMatchStats = {
      id: 'm-1',
      minute: 45,
      status: 'Live',
      homeScore: 2,
      awayScore: 1,
      homePossession: 60,
      awayPossession: 40,
      events: [
        { minute: 12, player: 'Messi', type: 'Goal', detail: 'Bottom corner', teamId: 'arg' }
      ]
    };

    render(<MatchCenterTab liveMatch={{ ...mockLiveMatchBase, data: mockData }} />);
    
    expect(screen.getAllByText(/Live/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/45'/)).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("60%")).toBeInTheDocument();
    expect(screen.getByText("40%")).toBeInTheDocument();
    
    // Check events
    expect(screen.getByText("Messi")).toBeInTheDocument();
    expect(screen.getByText("Goal")).toBeInTheDocument();
    expect(screen.getByText("Bottom corner")).toBeInTheDocument();
  });

  it('renders correctly with no events', () => {
    const mockData: ILiveMatchStats = {
      id: 'm-1',
      minute: 0,
      status: 'Pre-Match',
      homeScore: 0,
      awayScore: 0,
      homePossession: 50,
      awayPossession: 50,
      events: []
    };

    render(<MatchCenterTab liveMatch={{ ...mockLiveMatchBase, data: mockData }} />);
    
    expect(screen.getAllByText(/Pre-Match/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/0'/)).not.toBeInTheDocument();
    expect(screen.getByText("No major events yet.")).toBeInTheDocument();
  });
});
