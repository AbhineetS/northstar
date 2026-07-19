import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StadiumMapWidget } from '../StadiumMapWidget';

describe('StadiumMapWidget', () => {
  it('renders without crashing', () => {
    const { container } = render(<StadiumMapWidget gate='A' section='100' seat='1' />);
    expect(container).toBeInTheDocument();
  });
});
