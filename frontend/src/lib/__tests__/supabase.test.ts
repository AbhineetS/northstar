import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(),
  })),
}));

describe('supabase client', () => {
  beforeAll(() => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'http://localhost');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test');
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  it('should be defined', async () => {
    // We import dynamically to ensure the mock is applied first
    const { supabase } = await import('../supabase');
    expect(supabase).toBeDefined();
    expect(createClient).toHaveBeenCalled();
  });
});
