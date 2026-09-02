import { describe, expect, it } from 'vitest';
import config from './next.config.mjs';

describe('Next.js API cache headers', () => {
  it('prevents browsers and shared caches from storing API responses', async () => {
    const headers = await config.headers();

    expect(headers).toContainEqual({
      source: '/api/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'private, no-store, max-age=0, must-revalidate',
        },
      ],
    });
  });
});
