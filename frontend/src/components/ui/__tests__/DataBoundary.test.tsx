import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DataBoundary } from '../DataBoundary';

describe('DataBoundary', () => {
  it('renders children without crashing', () => {
    const mockState = { isLoading: false, error: null, isEmpty: false, data: 'test data', retry: vi.fn(), timestamp: 0 };
    render(
      <DataBoundary state={mockState}>
        {(data) => <div>{data}</div>}
      </DataBoundary>
    );
    expect(screen.getByText('test data')).toBeInTheDocument();
  });
});

