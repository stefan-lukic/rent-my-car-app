/**
 * Input.test.tsx
 *
 * Input komponenta je omotač oko native <input> elementa sa
 * Tailwind CSS klasama za konsistentan izgled u celoj aplikaciji.
 *
 * ARHITEKTURA TESTIRANJA:
 * - Ovo je komponenta test — proveravamo da li se input renderuje
 *   sa ispravnim atributima i da li prosleđuje className i ref.
 * - Koristimo accessibility-first pristup: getByRole('textbox').
 *
 * ZAŠTO OVAJ PRINCEPS:
 * - Input je "leaf" komponenta — samo prosleđuje atribute native inputu.
 * - Zato testiramo: osnovni render, prosleđivanje className, ref forwarding,
 *   i različite type vrednosti.
 */

import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  /**
   * TEST 1: Osnovni render sa placeholder-om
   * ZAŠTO: Proveravamo da komponenta renderuje input sa
   * prosleđenim placeholder-om i osnovnim Tailwind klasama.
   * KAKO: getByPlaceholderText pronazi element po placeholder atributu,
   * zatim proveravamo prisustvo i osnovne klase.
   */
  it('renders an input with placeholder and default classes', () => {
    render(<Input placeholder="Email" data-testid="input" />);

    const input = screen.getByPlaceholderText('Email');

    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('h-10');
    expect(input).toHaveClass('w-full');
  });

  /**
   * TEST 2: Prosleđivanje custom className
   * ZAŠTO: Treba verifikovati da komponenta spaja defaultne i custom
   * CSS klase putem cn() utility.
   * KAKO:
   * 1. Prosleđujemo className="custom-class"
   * 2. Proveravamo da input ima i default i custom klasu.
   */
  it('merges custom className with default classes', () => {
    render(<Input className="custom-class" data-testid="input" />);

    const input = screen.getByTestId('input');

    expect(input).toHaveClass('w-full');
    expect(input).toHaveClass('custom-class');
  });

  /**
   * TEST 3: Ref forwarding
   * ZAŠTO: Komponenta koristi React.forwardRef da bi omogućila
   * parent komponentama pristup DOM elementu.
   * KAKO:
   * 1. Kreiramo ref sa useRef()
   * 2. Prosleđujemo ga Input komponenti
   * 3. Proveravamo da ref.current pokazuje na input element.
   */
  it('forwards ref to the native input element', () => {
    const ref = React.createRef<HTMLInputElement>();

    render(<Input ref={ref} data-testid="input" />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.tagName).toBe('INPUT');
  });

  /**
   * TEST 4: Različiti type atributi
   * ZAŠTO: Treba verifikovati da type atribut stiže do native inputa,
   *   što je bitno za validaciju (email, password, number itd.).
   * KAKO: Proveravamo da su type="email" i type="password" ispravno
   *   prosleđeni.
   */
  it('passes type attribute to the native input', () => {
    const { rerender } = render(<Input type="email" data-testid="input" />);

    expect(screen.getByTestId('input')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" data-testid="input" />);

    expect(screen.getByTestId('input')).toHaveAttribute('type', 'password');
  });

  /**
   * TEST 5: Disabled stanje
   * ZAŠTO: Komponenta treba da podrži disabled atribut za
   *   onemogućavanje interakcije.
   * KAKO: Proveravamo da je input disabled kada joj se prosledi
   *   disabled prop.
   */
  it('supports disabled state', () => {
    render(<Input disabled data-testid="input" />);

    const input = screen.getByTestId('input');

    expect(input).toBeDisabled();
  });
});
