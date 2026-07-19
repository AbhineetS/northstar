import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '../route';
import { NextRequest } from 'next/server';

// Mock the Gemini SDK
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel() {
        return {
          generateContent: vi.fn().mockResolvedValue({
            response: {
              text: () => '```json\n[{"id":"REC-1","title":"Alert","priority":"high","context":"test","prediction":"test","action":"action","impact":"impact"}]\n```'
            }
          })
        };
      }
    }
  };
});

describe('POST /api/ai/ops-recommendations', () => {
  beforeEach(() => {
    vi.stubEnv('GEMINI_API_KEY', 'test_key');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it('returns 503 if API key is missing', async () => {
    vi.stubEnv('GEMINI_API_KEY', '');
    const req = new NextRequest('http://localhost/api/ai/ops-recommendations', {
      method: 'POST',
      body: JSON.stringify({ context: {} })
    });
    const res = await POST(req);
    expect(res.status).toBe(503);
  });

  it('handles JSON generation', async () => {
    const req = new NextRequest('http://localhost/api/ai/ops-recommendations', {
      method: 'POST',
      body: JSON.stringify({ context: { role: 'Organizer' } })
    });
    const res = await POST(req);
    
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data[0].id).toBe('REC-1');
  });
});
