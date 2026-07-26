/**
 * RentalCard.test.tsx
 *
 * RentalCard komponenta prikazuje jedan iznajmljen automobil sa:
 *   - Slikom automobila i status badge-om (Available, Booked, Inactive)
 *   - Markom i modelom automobila
 *   - Cenom po danu i lokacijom
 *   - Periodom iznajmljivanja (start -> end datum) i ukupnom cenom
 *
 * ARHITEKTURA TESTIRANJA:
 * - Ovo je komponenta test — proveravamo da li se svi elementi
 *   renderuju sa ispravnim podacima i da li se obrađuju edge case-ovi.
 * - next/image je mockovan jer jsdom ne podržava Next.js Image.
 *
 * ZAŠTO OVAJ PRINCEPS:
 * - RentalCard je "presentational" komponenta — samo prikazuje
 *   prosleđene podatke bez state-a.
 * - Zato testiramo: renderovanje osnovnih polja, status badge-ovi,
 *   fallback za nedostajući car, fallback za prazne slike.
 */

import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RentalCard from './RentalCard';
import l from '@/helper/en';
import { createNextImageMock } from '@/test-utils/mocks/next-image';
import { createMockRental } from '@/test-utils/fixtures/rental';
import { createMockCar } from '@/test-utils/fixtures/car';
createNextImageMock();

const mockRental = createMockRental();

describe('RentalCard', () => {
  const defaultProps = {
    rental: mockRental,
    showStatus: true,
  };

  /**
   * TEST 1: Renderuje make i model automobila
   * ZAŠTO: Osnovna informacija o automobilu mora biti vidljiva.
   * KAKO: getByText pronalazi tekst "MERCEDES C-Class" (enum vrednost
   *   je velikim slovima, komponenta je ne menja).
   */
  it('renders car make and model', () => {
    render(<RentalCard {...defaultProps} />);

    expect(screen.getByText(/MERCEDES/)).toBeInTheDocument();
    expect(screen.getByText(/C-Class/)).toBeInTheDocument();
  });

  /**
   * TEST 2: Renderuje cenu po danu i lokaciju
   * ZAŠTO: Korisnik treba da vidi koliko košta i gde je auto.
   * KAKO: getByText za €50 i lokaciju.
   */
  it('renders price per day and city', () => {
    render(<RentalCard {...defaultProps} />);

    expect(screen.getByText(/€50/)).toBeInTheDocument();
    expect(screen.getByText(/\//)).toBeInTheDocument();
    expect(screen.getByText('Belgrade')).toBeInTheDocument();
  });

  /**
   * TEST 3: Renderuje status badge za 'available' status
   * ZAŠTO: Status badge pomaže korisniku da vidi da li je auto
   *   trenutno dostupan za novu rezervaciju.
   * KAKO: getByText('Available') za status 'available'.
   */
  it('shows Available badge for available car', () => {
    const availableRental = createMockRental({
      car: createMockCar({ status: 'available' }),
    });

    render(<RentalCard {...defaultProps} rental={availableRental} />);

    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  /**
   * TEST 4: Renderuje status badge za 'rented' status
   * ZAŠTO: Kada je auto iznajmljen, badge treba da prikaže 'Booked'.
   * KAKO: getByText('Booked') za status 'rented'.
   */
  it('shows Booked badge for rented car', () => {
    const rentedRental = createMockRental({
      car: createMockCar({ status: 'rented' }),
    });

    render(<RentalCard {...defaultProps} rental={rentedRental} />);

    expect(screen.getByText('Booked')).toBeInTheDocument();
  });

  /**
   * TEST 5: Renderuje status badge za 'inactive' status
   * ZAŠTO: Neaktivni automobili treba da imaju 'Inactive' badge.
   * KAKO: getByText('Inactive') za status 'inactive'.
   */
  it('shows Inactive badge for inactive car', () => {
    const inactiveRental = createMockRental({
      car: createMockCar({ status: 'inactive' }),
    });

    render(<RentalCard {...defaultProps} rental={inactiveRental} />);

    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  /**
   * TEST 6: Default status je Available kada status nedostaje
   * ZAŠTO: Ako car.status nije definisan (undefined), treba
   *   prikazati podrazumevani 'available' badge.
   * KAKO: car bez statusa, proveravamo da je badge 'Available'.
   */
  it('defaults to Available badge when car status is missing', () => {
    const noStatusRental = createMockRental({
      car: createMockCar({ status: undefined }),
    });

    render(<RentalCard {...defaultProps} rental={noStatusRental} />);

    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  /**
   * TEST 7: Prikazuje ukupnu cenu iznajmljivanja
   * ZAŠTO: Ukupna cena (totalCost) je ključna informacija za korisnika.
   * KAKO: getByText('€200') za totalCost.
   */
  it('renders total rental cost', () => {
    render(<RentalCard {...defaultProps} />);

    expect(screen.getByText('€200')).toBeInTheDocument();
  });

  /**
   * TEST 8: Formira ispravan period iznajmljivanja
   * ZAŠTO: Korisnik treba da vidi tačne datume početka i kraja.
   * KAKO: Proveravamo prisustvo strelice (→) i da su datumi
   *   prisutni u DOM-u (proveravamo contain ALL datuma u roditelju).
   */
  it('renders rental period dates', () => {
    render(<RentalCard {...defaultProps} />);

    expect(screen.getByText('→')).toBeInTheDocument();

    const dateElements = screen.getAllByText(/2024/);

    expect(dateElements.length).toBeGreaterThanOrEqual(2);
  });

  /**
   * TEST 9: Fallback za praznu listu slika
   * ZAŠTO: Ako automobil nema fotografija, treba prikazati
   *   placeholder sliku.
   * KAKO: car.images: [], proveravamo da img ima src='/placeholder-car.svg'.
   */
  it('shows placeholder image when car has no images', () => {
    const noImagesRental = createMockRental({
      car: createMockCar({ images: [] }),
    });

    render(<RentalCard {...defaultProps} rental={noImagesRental} />);

    const placeholderImg = screen.getByRole('img', {
      name: /MERCEDES C-Class/,
    });

    expect(placeholderImg).toHaveAttribute('src', '/placeholder-car.svg');
  });

  /**
   * TEST 10: Prikazuje poruku o nedostupnosti kada car nedostaje
   *
   * ZAŠTO JE OVDE ISPRAVKA:
   * Umesto da eksplicitno prosledimo `car: null`, sad koristimo
   * `car: undefined` (ili ga jednostavno ne prosledimo uopšte).
   * Pošto je `car` opciono polje (`car?: ICar`), `undefined` je
   * "prirodna" vrednost za "car nije prisutan" — TypeScript ovo
   * podrazumeva automatski, bez potrebe za `null` bilo gde u tipu.
   */
  it('shows unavailable message when car is missing', () => {
    const noCarRental = createMockRental({ car: undefined });

    render(<RentalCard {...defaultProps} rental={noCarRental} />);

    expect(screen.getByText(l.common.unavailable)).toBeInTheDocument();
  });

  /**
   * TEST 11: showStatus prop sakriva status badge
   * ZAŠTO: U nekim kontekstima (npr. kartica iznajmljivanja na
   *   profilu) ne želimo da prikažemo badge jer je status očigledan.
   * KAKO: showStatus={false}, proveravamo da badge nije prisutan.
   */
  it('hides status badge when showStatus is false', () => {
    render(<RentalCard {...defaultProps} showStatus={false} />);

    expect(screen.queryByText('Available')).not.toBeInTheDocument();
  });

  /**
   * TEST 12: Formatira datume u dd MMM yyyy formatu (en-GB)
   * ZAŠTO: formatDate koristi toLocaleDateString('en-GB', ...) za
   *   konzistentan format datuma.
   * KAKO: Proveravamo da su datumi prikazani u očekivanom formatu
   *   (npr. "01 Aug 2024" — u ovoj jsdom konfiguraciji bez zareza).
   */
  it('formats dates in dd MMM yyyy format', () => {
    render(<RentalCard {...defaultProps} />);

    expect(screen.getByText('01 Aug 2024')).toBeInTheDocument();
    expect(screen.getByText('05 Aug 2024')).toBeInTheDocument();
  });
});
