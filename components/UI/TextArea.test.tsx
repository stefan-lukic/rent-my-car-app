/**
 * TextArea.test.tsx
 *
 * TextArea komponenta je omotač oko native <textarea> elementa sa
 * Tailwind CSS klasama za konsistentan izgled u celoj aplikaciji.
 *
 * ARHITEKTURA TESTIRANJA:
 * - Ovo je komponenta test — proveravamo da li se textarea renderuje
 *   sa ispravnim atributima i da li prosleđuje className i ref.
 * - Koristimo accessibility-first pristup: getByRole('textbox').
 *
 * ZAŠTO OVAJ PRINCEPS:
 * - TextArea je "leaf" komponenta — samo prosleđuje atribute native textarea.
 * - Zato testiramo: osnovni render, prosleđivanje className, ref forwarding.
 */

import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Textarea } from './TextArea';

describe('TextArea', () => {
  /**
   * TEST 1: Osnovni render sa placeholder-om
   * ZAŠTO: Proveravamo da komponenta renderuje textarea sa
   * prosleđenim placeholder-om i osnovnim Tailwind klasama.
   * KAKO: getByRole('textbox') pronazi element po ARIA ulozi, zatim
   * proveravamo placeholder, className i prisustvo u dokumentu.
   */
  it('renders a textarea with placeholder and default classes', () => {
    render(<Textarea placeholder="Enter description" data-testid="textarea" />);

    const textarea = screen.getByPlaceholderText('Enter description');

    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('placeholder', 'Enter description');
    expect(textarea).toHaveClass('min-h-[80px]');
    expect(textarea).toHaveClass('w-full');
  });

  /**
   * TEST 2: Prosleđivanje custom className
   * ZAŠTO: Treba verifikovati da komponenta spaja defaultne i custom
   * CSS klase putem cn() utility — ovo osigurava fleksibilnost.
   * KAKO:
   * 1. Prosleđujemo className="custom-class"
   * 2. Proveravamo da domaći element ima i default i custom klasu.
   */
  it('merges custom className with default classes', () => {
    render(<Textarea className="custom-class" data-testid="textarea" />);

    const textarea = screen.getByTestId('textarea');

    expect(textarea).toHaveClass('w-full');
    expect(textarea).toHaveClass('custom-class');
  });

  /**
   * TEST 3: Ref forwarding
   * ZAŠTO: Komponenta koristi React.forwardRef da bi omogućila
   * parent komponentama pristup DOM elementu.
   * KAKO:
   * 1. Kreiramo ref sa useRef()
   * 2. Prosleđujemo ga Textarea komponenti
   * 3. Proveravamo da ref.current pokazuje na textarea element.
   */
  it('forwards ref to the native textarea element', () => {
    const ref = React.createRef<HTMLTextAreaElement>();

    render(<Textarea ref={ref} data-testid="textarea" />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    expect(ref.current?.tagName).toBe('TEXTAREA');
  });

  /**
   * TEST 4: Prosleđivanje native HTML atributa
   * ZAŠTO: TextArea komponenta prosleđuje sve preostale props
   * native textarea elementu (name, id, disabled, itd.).
   * KAKO: Proveravamo da id i name atributi stižu do textarea.
   */
  it('passes native HTML attributes to the textarea element', () => {
    render(
      <Textarea id="description" name="description" disabled data-testid="textarea" />
    );

    const textarea = screen.getByTestId('textarea');

    expect(textarea).toHaveAttribute('id', 'description');
    expect(textarea).toHaveAttribute('name', 'description');
    expect(textarea).toBeDisabled();
  });
});
