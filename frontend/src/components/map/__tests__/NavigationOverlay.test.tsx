 
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { NavigationOverlay } from '../NavigationOverlay';

describe('NavigationOverlay', () => {
  it('renders correctly', () => {
    const { container } = render(
      <NavigationOverlay origin={{lat:0, lng:0}} destination={{lat:1, lng:1}} />
    );
    expect(container).toBeTruthy();
  });
  
  it('renders with origin and destination', () => {
    const { container } = render(<NavigationOverlay origin={{lat:0, lng:0}} destination={{lat:1, lng:1}} />);
    expect(container).toBeTruthy();
  });
});
