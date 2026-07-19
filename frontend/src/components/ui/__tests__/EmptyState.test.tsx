import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmptyState } from '../EmptyState';
import { Search } from 'lucide-react';

describe('EmptyState', () => {
  it('renders without crashing', () => {
    const { container } = render(<EmptyState icon={Search} title="Test" description="Test desc" />);
    expect(container).toBeInTheDocument();
  });
});

