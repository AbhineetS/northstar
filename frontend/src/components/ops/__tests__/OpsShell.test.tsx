import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { OpsShell } from '../OpsShell';

vi.mock('next/navigation', () => ({
  usePathname: () => '/ops',
}));

describe('OpsShell', () => {
  it('renders correctly', () => {
    const { container } = render(<OpsShell><div>Child</div></OpsShell>);
    expect(container).toBeTruthy();
  });
});
