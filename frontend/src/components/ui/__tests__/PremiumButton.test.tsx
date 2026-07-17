import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PremiumButton } from '../PremiumButton';

describe('PremiumButton', () => {
  it('renders children correctly', () => {
    render(<PremiumButton>Click Me</PremiumButton>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<PremiumButton onClick={handleClick}>Click Me</PremiumButton>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not render arrow when showArrow is false', () => {
    const { container } = render(<PremiumButton showArrow={false}>Click Me</PremiumButton>);
    // We check if the SVG arrow is rendered. ArrowRight component renders an svg.
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<PremiumButton disabled>Click Me</PremiumButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
