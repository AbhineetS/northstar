import { describe, it, expect, vi } from 'vitest';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { render } from '@testing-library/react';
import { PremiumButton } from '../PremiumButton';

describe('PremiumButton', () => {
  it('renders correctly', () => {
    const { container } = render(<PremiumButton>Click Me</PremiumButton>);
    expect(container).toBeTruthy();
  });
});
