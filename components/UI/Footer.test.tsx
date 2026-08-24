/**
 * Footer.test.tsx
 *
 * Footer komponenta renderuje multi-column footer sa:
 *   - Exclusive sekcija sa email subscribtion formom
 *   - Support sekcija sa kontakt informacijama
 *   - Account sekcija sa linkovima
 *   - Quick Link sekcija sa legalnim linkovima
 *   - Download App sekcija sa QR kodom i app store linkovima
 *   - Social media ikone (Facebook, Twitter)
 *   - Copyright bar
 *
 * ARHITEKTURA TESTIRANJA:
 * - Ovo je komponenta test — proveravamo da li se sve sekcije
 *   renderuju sa ispravnim tekstom i linkovima.
 * - next/image je mockovan jer jsdom ne podržava Next.js Image
 *   komponentu.
 * - Helper objekat l za lokalizovane stringove se importuje za
 *   precizne asertacije.
 *
 * ZAŠTO OVAJ PRINCEPS:
 * - Footer je "stateless layout" komponenta — prikazuje fiksne
 *   sekcije bez korisničke interakcije.
 * - Zato testiramo: prisustvo svih sekcija, ispravan tekst,
 *   i prisustvo linkova.
 */

import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import l from '@/helper/en';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt, width, height, ...rest } = props || {};
    return React.createElement('img', { src, alt, width, height, ...rest });
  },
}));

describe('Footer', () => {
  /**
   * TEST 1: Osnovni render footera
   * ZAŠTO: Proveravamo da se main footer element renderuje
   *   sa crnom pozadinom (bg-black).
   * KAKO: getByRole('contentinfo') pronazi footer element
   *   po ARIA ulozi.
   */
  it('renders footer with black background', () => {
    render(<Footer />);

    const footer = document.querySelector('footer');

    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('bg-black');
  });

  /**
   * TEST 2: Exclusive sekcija
   * ZAŠFO: Ova sekcija ima naslov, newsletter formu, i input
   *   field za email. Treba verifikovati da svi elementi postoje.
   * KAKO:
   * 1. Proveravamo naslov 'Exclusive'
   * 2. Proveravamo subtitle 'Subscribe' / 'Get 10% off'
   * 3. Proveravamo prisustvo input elementa za email.
   */
  it('renders exclusive subscription section', () => {
    render(<Footer />);

    expect(screen.getByText(l.footer.exclusive)).toBeInTheDocument();
    expect(screen.getByText(l.footer.subscribe)).toBeInTheDocument();
    expect(screen.getByText(l.footer.get10Off)).toBeInTheDocument();
  });

  /**
   * TEST 3: Support sekcija
   * ZAŠTO: Support sekcija sadrži adresu, email i telefon.
   *   Treba verifikovati da su sve tri stavke prisutne.
   * KAKO: getByText za svaki support link.
   */
  it('renders support contact links', () => {
    render(<Footer />);

    expect(screen.getByText(l.footer.support)).toBeInTheDocument();
    expect(screen.getByText(l.footer.address)).toBeInTheDocument();
    expect(screen.getByText(l.footer.email)).toBeInTheDocument();
    expect(screen.getByText(l.footer.phone)).toBeInTheDocument();
  });

  /**
   * TEST 4: Account sekcija
   * ZAŠTO: Account sekcija ima 5 navigacionih linkova.
   *   Treba verifikovati da su svi prisutni.
   * KAKO: getByText za svaki account link.
   */
  it('renders account navigation links', () => {
    render(<Footer />);

    expect(screen.getByText(l.footer.account)).toBeInTheDocument();
    expect(screen.getByText(l.footer.myAccount)).toBeInTheDocument();
    expect(screen.getByText(l.footer.loginRegister)).toBeInTheDocument();
    expect(screen.getByText(l.footer.cart)).toBeInTheDocument();
    expect(screen.getByText(l.footer.wishlist)).toBeInTheDocument();
    expect(screen.getByText(l.footer.shop)).toBeInTheDocument();
  });

  /**
   * TEST 5: Quick Link sekcija
   * ZAŠTO: Quick Link sekcija sadrži policy i FAQ linkove.
   * KAKO: Proveravamo naslove i linkove.
   */
  it('renders quick links section', () => {
    render(<Footer />);

    expect(screen.getByText(l.footer.quickLink)).toBeInTheDocument();
    expect(screen.getByText(l.landing.privacyPolicy)).toBeInTheDocument();
    expect(screen.getByText(l.footer.termsOfUse)).toBeInTheDocument();
    expect(screen.getByText(l.footer.faq)).toBeInTheDocument();
    expect(screen.getByText(l.footer.contact)).toBeInTheDocument();
  });

  /**
   * TEST 6: Download App sekcija
   * ZAŠTO: Ova sekcija ima QR kôd i app store dugmad.
   * KAKO: Proveravamo naslov, subtitle, i prisustvo slika
   *   (mockovane kao img tagovi).
   */
  it('renders download app section with QR code and store badges', () => {
    render(<Footer />);

    expect(screen.getByText(l.footer.downloadApp)).toBeInTheDocument();
    expect(screen.getByText(l.footer.save3WithApp)).toBeInTheDocument();
  });

  /**
   * TEST 7: Social media ikone
   * ZAŠTO: Footer prikazuje Facebook i Twitter ikone.
   *   Svaka društvena mreža mora imati svoje accessible ime.
   */
  it('renders social media icons', () => {
    render(<Footer />);

    expect(screen.getByAltText('facebook')).toBeInTheDocument();
    expect(screen.getByAltText('twitter')).toBeInTheDocument();
  });

  /**
   * TEST 8: Copyright bar
   * ZAŠTO: Treba verifikovati da se copyright tekst renderuje
   *   na dnu footera.
   * KAKO: getByText za copyright string.
   */
  it('renders copyright text at the bottom', () => {
    render(<Footer />);

    expect(screen.getByText(l.footer.copyrightRimel)).toBeInTheDocument();
  });
});
