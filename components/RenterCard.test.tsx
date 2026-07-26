/**
 * RenterCard.test.tsx
 *
 * RenterCard komponenta prikazuje informacije o iznajmljivaču:
 *   - Profilna slika ili inicijali ako slike nema
 *   - Ime korisnika
 *   - Ocenu (rating) ako je veća od 0
 *
 * ARHITEKTURA TESTIRANJA:
 * - Ovo je komponenta test — proveravamo da li se svi elementi
 *   renderuju sa ispravnim podacima.
 * - next/image i next/link su mockovani jer su "leaf" komponente
 *   sa Next.js zavisnostima.
 *
 * ZAŠTO OVAJ PRINCEPS:
 * - RenterCard je "presentational" komponenta — prikazuje podatke
 *   o korisniku i linkuje na njegov profil.
 * - Zato testiramo: renderovanje imena, inicijala, ocene,
 *   i fallback za sliku.
 */

import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RenterCard from './RenterCard';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt, width, height, ...rest } = props || {};
    return React.createElement('img', { src, alt, width, height, ...rest });
  },
}));

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

const mockRenterWithImage = {
  _id: 'renter-1',
  name: 'Marko Markovic',
  rating: 4.5,
  images: ['/avatar.jpg'],
  profilePicture: '/avatar.jpg',
};

const mockRenterWithoutImage = {
  _id: 'renter-2',
  name: 'Ana Jovanovic',
  rating: 0,
  images: [],
  profilePicture: '',
};

describe('RenterCard', () => {
  /**
   * TEST 1: Renderuje ime iznajmljivača
   * ZAŠTO: Ime je primarna informacija o korisniku.
   * KAKO: getByText pronazi ime unutar kartice.
   */
  it('renders renter name', () => {
    render(<RenterCard renter={mockRenterWithImage} />);

    expect(screen.getByText('Marko Markovic')).toBeInTheDocument();
  });

  /**
   * TEST 2: Renderuje profilnu sliku kada postoji
   * ZAŠTO: Profilna slika poboljšava UX — korisnik prepoznaje
   *   iznajmljivača vizuelno.
   * KAKO: getByRole('img', { name: 'Marko Markovic' }) pronazi sliku
   *   sa odgovarajućim alt atributom.
   */
  it('renders profile image when provided', () => {
    render(<RenterCard renter={mockRenterWithImage} />);

    const profileImage = screen.getByRole('img', { name: 'Marko Markovic' });

    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute('src', '/avatar.jpg');
  });

  /**
   * TEST 3: Renderuje inicijale kada nema profilne slike
   * ZAŠTO: Ako korisnik nema profilnu sliku, komponenta mora
   *   prikazati inicijale imena kao fallback.
   * KAKO: getByText('AJ') za 'Ana Jovanovic'.
   */
  it('renders initials fallback when no profile image exists', () => {
    render(<RenterCard renter={mockRenterWithoutImage} />);

    expect(screen.getByText('AJ')).toBeInTheDocument();
  });

  /**
   * TEST 4: Inicijali se klippuju na 2 karaktera
   * ZAŠTO: Dugačka imena treba da generišu samo prva dva slova
   *   (npr. "Marko Markovic" -> "MM").
   * KAKO: Prosleđujemo ime sa 4 reči, proveravamo da su
   *   inicijali samo prva dva slova.
   */
  it('clips initials to first 2 characters', () => {
    const longNameRenter = {
      ...mockRenterWithoutImage,
      name: 'Marko Antun Markovic',
    };

    render(<RenterCard renter={longNameRenter} />);

    expect(screen.getByText('MA')).toBeInTheDocument();
  });

  /**
   * TEST 5: Renderuje ocenu kada je veća od 0
   * ZAŠTO: Ocena je bitna informacija za poverenje — treba
   *   videti zvezdicu i broj.
   * KAKO: getByText('★') i getByText('4.5').
   */
  it('renders rating when greater than 0', () => {
    render(<RenterCard renter={mockRenterWithImage} />);

    expect(screen.getByText('★')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  /**
   * TEST 6: Sakriva ocenu kada je 0 ili manje
   * ZAŠTO: Ako korisnik nema ocenu, ne želimo da prikažemo
   *   "0.0" — bolje je sakriti ceo rating deo.
   * KAKO: renter.rating = 0, proveravamo da nema '0.0' u DOM-u.
   */
  it('hides rating when rating is 0', () => {
    render(<RenterCard renter={mockRenterWithoutImage} />);

    expect(screen.queryByText('0.0')).not.toBeInTheDocument();
    expect(screen.queryByText('★')).not.toBeInTheDocument();
  });

  /**
   * TEST 7: Linkuje na profilnu stranicu iznajmljivača
   * ZAŠTO: RenterCard je klikabilna i vodi na /profile/:id.
   * KAKO: getByRole('link', { name: /Marko Markovic/ }) pronazi
   *   <a> element i proveravamo href.
   */
  it('links to the renter profile page', () => {
    render(<RenterCard renter={mockRenterWithImage} />);

    const link = screen.getByRole('link', { name: /Marko Markovic/ });

    expect(link).toHaveAttribute('href', '/profile/renter-1');
  });

  /**
   * TEST 8: Obrće inicijale velikim slovima
   * ZAŠTO: Inicijale treba da budu uvek uppercase radi
   *   konzistentnog izgleda.
   * KAKO: Ime sa malim slovima, proveravamo uppercase inicijale.
   */
  it('converts initials to uppercase', () => {
    const lowerCaseRenter = {
      ...mockRenterWithoutImage,
      name: 'marko markovic',
    };

    render(<RenterCard renter={lowerCaseRenter} />);

    expect(screen.getByText('MM')).toBeInTheDocument();
  });
});
