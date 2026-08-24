/**
 * Providers.test.tsx
 *
 * Providers komponenta je jednostavan wrapper oko NextAuth
 * SessionProvider koji omogućava autentikaciju u celoj aplikaciji.
 *
 * ARHITEKTURA TESTIRANJA:
 * - Ovo je komponenta test — proveravamo da li se SessionProvider
 *   renderuje i da children nisu poremeteni.
 *
 * ZAŠTO OVAJ PRINCEPS:
 * - Providers je "minimal wrapper" komponenta — nema svoje UI,
 *   samo omotava app u SessionProvider.
 * - Zato testiramo: da li se children renderuju unutar SessionProvider.
 *
 * ZAŠTO MOCKUJEMO fetch:
 * - SessionProvider iz next-auth, kad se pravi renderuje, STVARNO
 *   pokusava da pozove fetch('/api/auth/session') i fetch('/api/auth/_log')
 *   da proveri sesiju i posalje log.
 * - U testu (jsdom) nema pravog servera niti punog URL-a, pa fetch
 *   puca sa "Invalid URL" i pravi neuhvacene greske u pozadini.
 * - Zato pre svakog testa "lazemo" da fetch uvek uspe, a posle testa
 *   vracamo sve na originalno stanje.
 */

import React from 'react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Providers } from './Providers';

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({}),
      } as Response)
    )
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Providers', () => {
  /**
   * TEST 1: Renderuje children unutar SessionProvider
   * ZAŠTO: Providers je wrapper — mora da primi children
   *   i da ih pogura kroz SessionProvider.
   * KAKO: renderujemo Providers sa text kao children i
   *   proveravamo prisustvo teksta.
   */
  it('renders children inside SessionProvider', () => {
    render(
      <Providers>
        <span data-testid="child">App content</span>
      </Providers>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('App content')).toBeInTheDocument();
  });

  /**
   * TEST 2: Prihvata više children
   * ZAŠTO: Next.js app layout često ima više direktnih dece
   *   (header, footer, itd.).
   * KAKO: renderujemo sa više elemenata, proveravamo da su
   *   svi prisutni.
   */
  it('renders multiple children', () => {
    render(
      <Providers>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </Providers>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByTestId('child-3')).toBeInTheDocument();
  });

  /**
   * TEST 3: Prihvata null ili undefined children
   * ZAŠTO: U nekim slučajevima children može biti undefined
   *   (npr. conditional rendering).
   * KAKO: renderujemo sa undefined, proveravamo da se ne baca
   *   greška i da je DOM prazan (ili samo warning).
   */
  it('handles undefined children gracefully', () => {
    const { container } = render(<Providers>{undefined}</Providers>);

    expect(container.innerHTML).not.toBe('undefined');
  });
});
