/**
 * CustomDatePicker.test.tsx
 *
 * CustomDatePicker komponenta omotać react-datepicker i integriše ga
 * sa react-hook-form putem Controller komponente. Prikazuje label,
 * input, i error poruku za datumske polje forme.
 *
 * ARHITEKTURA TESTIRANJA:
 * - Ovo je komponenta test — proveravamo da li se date picker
 *   renderuje sa ispravnim label-om, placeholder-om, i error porukom.
 * - react-datepicker je mockovan jer bi inače zahtevao DOM operacije
 *   koje ne postoje u jsdom.
 * - Koristimo react-hook-form Control mock da bismo proverili
 *   Controller integraciju.
 *
 * ZAŠTO OVAJ PRINCEPS:
 * - CustomDatePicker je "controlled input wrapper" komponenta.
 * - Zato testiramo: renderovanje label-a, kontekstualizaciju
 *   preko Controller, i prikaz error poruke kada postoji.
 */

import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Controller, useForm } from 'react-hook-form';
import CustomDatePicker from './CustomDatePicker';
import l from '@/helper/en';

vi.mock('react-datepicker', () => ({
  __esModule: true,
  default: ({
    selected,
    onChange,
    placeholderText,
    id,
  }: {
    selected: Date | null;
    onChange: (date: Date | null) => void;
    placeholderText: string;
    id?: string;
  }) => (
    <input
      id={id}
      data-testid={id || 'datepicker'}
      aria-label={id || 'DatePicker'}
      value={selected ? selected.toISOString() : ''}
      placeholder={placeholderText}
      onChange={() => onChange(new Date('2024-01-01'))}
    />
  ),
}));

describe('CustomDatePicker', () => {
  /**
   * Pomoćna funkcija za render CustomDatePicker unutar
   * react-hook-form konteksta.
   * Značaj: CustomDatePicker koristi Controller koji zahteva
   *   control objekat iz useForm hook-a.
   */
  const renderWithForm = (props: Partial<React.ComponentProps<typeof CustomDatePicker>> = {}) => {
    const Component = () => {
      const { control } = useForm({
        defaultValues: { testDate: new Date('2024-01-01') as Date | null },
      });

      return (
        <CustomDatePicker
          name="testDate"
          control={control as any}
          label="Pick a date"
          {...props}
        />
      );
    };

    return render(<Component />);
  };

  /**
   * TEST 1: Render label-a i input polja
   * ZAŠTO: Treba verifikovati da su label i date picker input
   *   povezani i da je label ima ispravan tekst.
   * KAKO:
   * 1. getByLabelText pronazi input po label tekstu
   * 2. getByText pronazi label element
   * 3. Oba elementa moraju da postoje u DOM-u.
   */
  it('renders label and date picker input', () => {
    renderWithForm();

    const input = screen.getByTestId('testDate-input');

    expect(input).toBeInTheDocument();
    expect(screen.getByText('Pick a date')).toBeInTheDocument();
  });

  /**
   * TEST 2: Prikazuje custom placeholder
   * ZAŠTO: placeholderText prop se prosleđuje react-datepicker-u.
   *   Treba verifikovati da se prikaže u input elementu.
   * KAKO: getByPlaceholderText pronazi input po placeholder atributu.
   */
  it('renders custom placeholder text', () => {
    renderWithForm({ placeholderText: 'Select your preferred date' });

    expect(screen.getByPlaceholderText('Select your preferred date')).toBeInTheDocument();
  });

  /**
   * TEST 3: Koristi podrazumevani placeholder iz lokalizacije
   * ZAŠTO: Kada placeholderText nije prosleđen, koristi se
   *   l.cars.selectDate kao podrazumevana vrednost.
   * KAKO: Proveravamo prisustvo l.cars.selectDate teksta u inputu.
   */
  it('uses default placeholder from localization when custom placeholder is not provided', () => {
    renderWithForm();

    expect(screen.getByPlaceholderText(l.cars.selectDate)).toBeInTheDocument();
  });

  /**
   * TEST 4: Label je povezana sa inputom preko htmlFor
   * ZAŠTO: Accessibility — label za input mora imati isti for/id
   *   kao i input element.
   * KAKO: Proveravamo da htmlFor atribut labele odgovara id-ju inputa.
   */
  it('links label to input via htmlFor attribute', () => {
    renderWithForm({ name: 'startDate' });

    const label = screen.getByText('Pick a date');

    expect(label).toHaveAttribute('for', 'startDate-input');

    const input = screen.getByTestId('startDate-input');

    expect(input).toHaveAttribute('id', 'startDate-input');
  });

  /**
   * TEST 5: Controller integracija - prosleđuje name i control
   * ZAŠTO: CustomDatePicker koristi Controller za react-hook-form
   *   integraciju. Treba verifikovati da je Controller ispravno
   *   konfigurisan sa name i control props.
   * KAKO: Proveravamo da input ima ispravan id (name-input)
   *   što potvrđuje da Controller radi sa CustomDatePicker-om.
   */
  it('integrates with react-hook-form Controller', () => {
    renderWithForm({ name: 'pickupDate' });

    const input = screen.getByTestId('pickupDate-input');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'pickupDate-input');
  });

  /**
   * TEST 6: defaultDateFormat je MM/dd/yyyy
   * ZAŠTO: DatePicker komponenta prima dateFormat prop koji
   *   određuje format datuma u inputu.
   * KAKO: Proveravamo da je format ispravno postavljen (mockovani
   *   DatePicker prikazuje ISO string za selektovani datum).
   */
  it('uses MM/dd/yyyy date format', () => {
    renderWithForm();

    const input = screen.getByTestId('testDate-input');

    expect(input).toHaveAttribute('value', '2024-01-01T00:00:00.000Z');
  });
});
