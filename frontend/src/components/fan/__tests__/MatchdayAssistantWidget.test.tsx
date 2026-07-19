import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MatchdayAssistantWidget } from '../MatchdayAssistantWidget';

describe('MatchdayAssistantWidget', () => {
  it('renders without crashing', () => {
    const { container } = render(<MatchdayAssistantWidget />);
    expect(container).toBeInTheDocument();
  });
});
