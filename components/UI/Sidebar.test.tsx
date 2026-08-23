/**
 * Sidebar.test.tsx
 *
 * Sidebar komponenta renderuje listu navigacionih linkova iz
 * helper/constants.ts sidebarLinks niza. Svaki link ima label
 * i opcionu Image ikonu.
 *
 * ARHITEKTURA TESTIRANJA:
 * - Ovo je komponenta test — proveravamo da li se svi linkovi
 *   iz sidebarLinks konfiguracije renderuju.
 * - next/image je mockovan jer jsdom ne podržava Next.js Image.
 * - sidebarLinks se importuje iz helper/constants — testiramo
 *   da su sve stavke prisutne u DOM-u.
 *
 * ZAŠTO OVAJ PRINCEPS:
 * - Sidebar je "configuration-driven" komponenta — renderuje
 *   listu koja dolazi iz vanjske konfiguracije.
 * - Zato testiramo: da li se svi linkovi renderuju, da li
 *   su href atributi ispravni, i da li se ikone prikazuju.
 */

import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Sidebar from './Sidebar';
import { sidebarLinks } from '@/helper/constants';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt, width, height, ...rest } = props || {};
    return React.createElement('img', { src, alt, width, height, ...rest });
  },
}));

describe('Sidebar', () => {
  /**
   * TEST 1: Osnovni render sidebar-a
   * ZAŠTO: Proveravamo da se sidebar container renderuje
   *   sa ispravnim klasama za layout.
   * KAKO: getByRole je nepogodan jer Sidebar nema ARIA ulogu,
   *   koristimo container.querySelector za pronalaženje <div>
   *   ili <ul> elemenata.
   */
  it('renders sidebar container', () => {
    const { container } = render(<Sidebar />);

    const sidebar = container.querySelector('.border-r');

    expect(sidebar).toBeInTheDocument();
  });

  /**
   * TEST 2: Renderuje sve sidebar linkove
   * ZAŠTO: SidebarItems (sidebarLinks) dolaze iz konfiguracije.
   *   Treba verifikovati da su sve stavke prisutne.
   * KAKO:
   * 1. Iteriramo kroz sidebarLinks
   * 2. Proveravamo da svaki item.label postoji u DOM-u
   */
  it('renders all sidebar links from configuration', () => {
    render(<Sidebar />);

    for (const link of sidebarLinks) {
      expect(screen.getByText(link.label)).toBeInTheDocument();
    }
  });

  /**
   * TEST 3: Linkovi imaju ispravne href atribute
   * ZAŠTO: Svaki sidebar link mora da pokazuje na tačnu stranicu.
   * KAKO: getByRole('link', { name: label }) pronazi <a> element
   *   i proveravamo href atribut.
   */
  it('links have correct href attributes', () => {
    render(<Sidebar />);

    for (const link of sidebarLinks) {
      const anchor = screen.getByRole('link', {
        name: new RegExp(link.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
      });

      expect(anchor).toHaveAttribute('href', link.link);
    }
  });

  /**
   * TEST 4: Ikone se renderuju za stavke koje imaju icon
   * ZAŠTO: Neki sidebarItems imaju ikone, drugi nemaju.
   *   Treba verifikovati da se ikone prikazuju gde je definisano.
   * KAKO: Proveravamo da za svaki item sa icon postoji <img>
   *   element unutar link-a.
   */
  it('renders icons for sidebar items that have them', () => {
    const { container } = render(<Sidebar />);

    const itemsWithIcons = sidebarLinks.filter((item) => item.icon);

    for (const item of itemsWithIcons) {
      const anchors = screen.getAllByRole('link', {
        name: new RegExp(item.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
      });

      const anchor = anchors[0];

      const images = anchor.querySelectorAll('img');

      expect(images.length).toBeGreaterThanOrEqual(1);
    }
  });

  /**
   * TEST 5: Prikazuje ispravan broj linkova
   * ZAŠTO: sidebarLinks niz ima fiksnu dužinu — ako se
   *   konfiguracija promeni, ovaj test će uhvatiti nove/obrisane linkove.
   * KAKO: getByRole('link') vraća sve <a> elemente i poređujemo
   *   njihov broj sa dužinom sidebarLinks niza.
   */
  it('renders correct number of sidebar links', () => {
    render(<Sidebar />);

    const links = screen.getAllByRole('link');

    expect(links.length).toBe(sidebarLinks.length);
  });
});
