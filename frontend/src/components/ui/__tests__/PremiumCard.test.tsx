import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PremiumCard } from '../PremiumCard';

describe('PremiumCard', () => {
  it('renders without crashing', () => {
    const { container } = render(<PremiumCard><div>Test</div></PremiumCard>);
    expect(container).toBeInTheDocument();
  });
});
