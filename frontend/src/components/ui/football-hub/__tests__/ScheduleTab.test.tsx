import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ScheduleTab } from '../ScheduleTab';
import { IScheduleItem } from '@/services/interfaces';

describe('ScheduleTab', () => {
  const mockScheduleBase = {
    isLoading: false,
    error: null,
    retry: vi.fn(),
    isEmpty: false,
  };

  it('renders loading state', () => {
    render(<ScheduleTab schedule={{ ...mockScheduleBase, isLoading: true, data: null }} />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('renders schedule list', () => {
    const mockData: IScheduleItem[] = [
      {
        id: '1',
        date: new Date('2026-07-19T15:00:00Z'),
        homeTeam: 'Team A',
        awayTeam: 'Team B',
        venue: 'Stadium 1',
        status: 'Upcoming',
        homeTeamId: 'a',
        awayTeamId: 'b',
        homeScore: 0,
        awayScore: 0
      },
      {
        id: '2',
        date: new Date('2026-07-20T18:00:00Z'),
        homeTeam: 'Team C',
        awayTeam: 'Team D',
        venue: 'Stadium 2',
        status: 'Live',
        homeTeamId: 'c',
        awayTeamId: 'd',
        homeScore: 1,
        awayScore: 0
      }
    ];

    render(<ScheduleTab schedule={{ ...mockScheduleBase, data: mockData }} />);
    
    expect(screen.getByText('Team A vs Team B')).toBeInTheDocument();
    expect(screen.getByText(/Stadium 1/)).toBeInTheDocument();
    expect(screen.getByText('Upcoming')).toBeInTheDocument();

    expect(screen.getByText('Team C vs Team D')).toBeInTheDocument();
    expect(screen.getByText(/Stadium 2/)).toBeInTheDocument();
    expect(screen.getByText('Live')).toBeInTheDocument();
  });
});
