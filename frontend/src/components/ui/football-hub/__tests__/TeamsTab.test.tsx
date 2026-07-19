import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TeamsTab } from '../TeamsTab';
import { ITeamProfile } from '@/services/interfaces';

vi.mock('../TeamSquadList', () => ({
  TeamSquadList: ({ teamId }: { teamId: string }) => <div data-testid={`squad-list-${teamId}`}>Squad for {teamId}</div>
}));

describe('TeamsTab', () => {
  const mockTeamsBase = {
    isLoading: false,
    error: null,
    retry: vi.fn(),
    isEmpty: false,
  };

  it('renders loading state', () => {
    render(<TeamsTab teams={{ ...mockTeamsBase, isLoading: true, data: null }} />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('renders list of teams and expands squad', () => {
    const mockData: ITeamProfile[] = [
      {
        id: 'team1',
        name: 'Argentina',
        code: 'ARG',
        coach: 'Scaloni',
        formation: '4-3-3',
        logo: '🇦🇷',
        recentForm: ['W']
      },
      {
        id: 'team2',
        name: 'Brazil',
        code: 'BRA',
        coach: 'Dorival',
        formation: '4-2-3-1',
        logo: '🇧🇷',
        recentForm: ['W']
      }
    ];

    render(<TeamsTab teams={{ ...mockTeamsBase, data: mockData }} />);
    
    expect(screen.getByText('Argentina')).toBeInTheDocument();
    expect(screen.getByText(/Scaloni/)).toBeInTheDocument();
    expect(screen.getByText('Brazil')).toBeInTheDocument();

    expect(screen.queryByTestId('squad-list-team1')).not.toBeInTheDocument();
    
    // Click to expand
    fireEvent.click(screen.getByText('Argentina'));
    expect(screen.getByTestId('squad-list-team1')).toBeInTheDocument();

    // Click again to collapse
    fireEvent.click(screen.getByText('Argentina'));
    expect(screen.queryByTestId('squad-list-team1')).not.toBeInTheDocument();
  });
});
