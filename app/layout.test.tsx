import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/font/google', () => ({
  Inter: () => ({ variable: 'inter' }),
  Manrope: () => ({ variable: 'manrope' }),
}));

vi.mock('@/components/Providers', () => ({
  Providers: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('@/components/mobile/MobileFooter', () => ({
  default: () => null,
}));

vi.mock('@/components/ServiceWorkerRegistration', () => ({
  default: () => null,
}));

vi.mock('@vercel/analytics/react', () => ({
  Analytics: () => null,
}));

vi.mock('@vercel/speed-insights/next', () => ({
  SpeedInsights: () => null,
}));

import RootLayout, { viewport } from './layout';

describe('Root layout viewport metadata', () => {
  it('uses one accessible Next.js viewport configuration', () => {
    expect(viewport).toEqual({
      width: 'device-width',
      initialScale: 1,
      viewportFit: 'cover',
      themeColor: '#F8FAFC',
    });

    const markup = renderToStaticMarkup(
      <RootLayout>
        <main>Page content</main>
      </RootLayout>
    );

    expect(markup.match(/<main/g)).toHaveLength(1);
    expect(markup).not.toContain('name="viewport"');
    expect(markup).not.toContain('ios-pwa-fix');
    expect(markup).not.toContain("overflow = 'hidden'");
  });
});
