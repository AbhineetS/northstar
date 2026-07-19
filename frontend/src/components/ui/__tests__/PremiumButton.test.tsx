import { describe, it, expect } from 'vitest';
 
import { render } from '@testing-library/react';
import { PremiumButton } from '../PremiumButton';

describe('PremiumButton', () => {
  it('renders correctly', () => {
    const { container } = render(<PremiumButton>Click Me</PremiumButton>);
    expect(container).toBeTruthy();
  });
});
