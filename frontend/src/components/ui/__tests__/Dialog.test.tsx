import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Dialog } from '../Dialog';

describe('Dialog', () => {
  it('renders without crashing', () => {
    const { container } = render(<Dialog isOpen={true} onClose={() => {}}><div>Test</div></Dialog>);
    expect(container).toBeInTheDocument();
  });
});
