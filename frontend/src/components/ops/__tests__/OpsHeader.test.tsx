/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { OpsHeader } from '../OpsHeader';

describe('OpsHeader', () => {
  it('renders correctly', () => {
    const mockWeatherState = { data: null, isLoading: false, error: null, isEmpty: true, retry: async () => {} };
    const { container } = render(<OpsHeader currentPhase="NORMAL" weatherState={mockWeatherState as any} />);
    expect(container).toBeTruthy();
  });
});
