import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TeamSquadList } from '../TeamSquadList';
import * as useServiceHook from '@/hooks/useService';

vi.mock('@/hooks/useService');

describe('TeamSquadList', () => {
  it('renders loading state', () => {
    vi.spyOn(useServiceHook, 'useService').mockReturnValue({
      isLoading: true,
      error: null,
      isEmpty: false,
      data: null,
      retry: vi.fn()
    });

    render(<TeamSquadList teamId="test" />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('renders squad players', () => {
    vi.spyOn(useServiceHook, 'useService').mockReturnValue({
      isLoading: false,
      error: null,
      isEmpty: false,
      data: [
        { id: '1', name: 'Messi', number: 10, position: 'FW', rating: 94 },
        { id: '2', name: 'Martinez', number: 23, position: 'GK', rating: 89 }
      ],
      retry: vi.fn()
    });

    render(<TeamSquadList teamId="test" />);
    
    expect(screen.getByText('Messi')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('FW')).toBeInTheDocument();
    expect(screen.getByText('94')).toBeInTheDocument();

    expect(screen.getByText('Martinez')).toBeInTheDocument();
  });

  it('renders empty message when no players', () => {
    vi.spyOn(useServiceHook, 'useService').mockReturnValue({
      isLoading: false,
      error: null,
      isEmpty: false,
      data: [],
      retry: vi.fn()
    });

    render(<TeamSquadList teamId="test" />);
    expect(screen.getByText('Squad information not available.')).toBeInTheDocument();
  });
});
