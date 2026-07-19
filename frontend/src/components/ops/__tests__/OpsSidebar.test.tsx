import { describe, it, expect, vi } from 'vitest';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { render, screen } from '@testing-library/react';
import { OpsSidebar } from '../OpsSidebar';

vi.mock('next/navigation', () => ({
  usePathname: () => '/ops',
}));

describe('OpsSidebar', () => {
  it('renders correctly', () => {
    const { container } = render(<OpsSidebar currentPhase="NORMAL" pathname="/" navItems={[]} />);
    expect(screen.getByText('NORTHSTAR')).toBeInTheDocument();
  });
});
