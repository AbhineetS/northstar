import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MagneticButton } from '../MagneticButton';

describe('MagneticButton', () => {
  it('renders without crashing', () => {
    const { container } = render(<MagneticButton><div>Test</div></MagneticButton>);
    expect(container).toBeInTheDocument();
  });
});
