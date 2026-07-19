import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '../route';
import { NextRequest } from 'next/server';

// Mock the Gemini SDK
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel() {
        return {
          generateContentStream: vi.fn().mockResolvedValue({
            stream: (async function* () {
              yield { text: () => 'Hello ' };
              yield { text: () => 'World!' };
            })()
          })
        };
      }
    }
  };
});

describe('POST /api/ai/chat', () => {
  beforeEach(() => {
    vi.stubEnv('GEMINI_API_KEY', 'test_key');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it('returns 503 if API key is missing', async () => {
    vi.stubEnv('GEMINI_API_KEY', '');
    const req = new NextRequest('http://localhost/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [] })
    });
    const res = await POST(req);
    expect(res.status).toBe(503);
  });

  it('handles chat stream generation', async () => {
    const req = new NextRequest('http://localhost/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Hi' }] })
    });
    const res = await POST(req);
    
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
    
    // Read the stream
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let text = '';
    
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
      }
    }
    
    expect(text).toBe('Hello World!');
  });
});
