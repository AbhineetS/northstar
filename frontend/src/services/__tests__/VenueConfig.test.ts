import { describe, it, expect } from 'vitest';
import { VENUE_FOOD_VENDORS, VENUE_WASHROOMS } from '../VenueConfig';

describe('VenueConfig', () => {
  it('should define venues correctly', () => {
    expect(VENUE_FOOD_VENDORS).toBeDefined();
    expect(VENUE_WASHROOMS).toBeDefined();
    expect(VENUE_FOOD_VENDORS.length).toBeGreaterThan(0);
  });
});
