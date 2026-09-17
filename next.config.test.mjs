import { describe, expect, it } from 'vitest';
import config, { pwaConfig } from './next.config.mjs';

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

describe('Next.js browser security headers', () => {
  it('applies the security baseline to every route', async () => {
    const headers = await config.headers();
    const globalRule = headers.find(({ source }) => source === '/(.*)');
    const headerValues = Object.fromEntries(
      globalRule.headers.map(({ key, value }) => [key, value])
    );

    expect(headerValues['Content-Security-Policy']).toContain(
      "default-src 'self'"
    );
    expect(headerValues['Content-Security-Policy']).toContain(
      "frame-ancestors 'none'"
    );
    expect(headerValues['Content-Security-Policy']).toContain(
      'https://maps.googleapis.com'
    );
    expect(headerValues).toMatchObject({
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy':
        'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
    });
  });
});

describe('Next.js PWA configuration', () => {
  it('uses the custom registrar and excludes unavailable build manifests', () => {
    expect(pwaConfig.register).toBe(false);
    expect(
      pwaConfig.buildExcludes.some((pattern) =>
        pattern.test('app-build-manifest.json')
      )
    ).toBe(true);
  });
});
