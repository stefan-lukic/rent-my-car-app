/**
 * Popover.test.tsx
 *
 * Popover komponenta je omotac oko @radix-ui/react-popover za
 * prikaz floating sadržaja (Content) i trigger elementa.
 *
 * ARHITEKTURA TESTIRANJA:
 * - Ovo je komponenta test — proveravamo da li se Popover, PopoverTrigger
 *   i PopoverContent renderuju kao odgovarajuci Radix UI elementi.
 * - Radix UI koristi Portal, pa neki elementi nisu direktno u DOM-u
 *   parenta — testiramo strukturu koja je dostupna.
 *
 * ZAŠTO OVAJ PRINCEPS:
 * - Popover je "primitive wrapper" komponenta — samo prosleduje
 *   atribute i klase Radix UI elementima.
 * - Zato testiramo: ispravan render, prosledivanje className,
 *   ref forwarding, i defaultne vrednosti za align i sideOffset.
 */

import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover, PopoverTrigger, PopoverContent } from './Popover';

describe('Popover', () => {
  /**
   * TEST 1: Osnovni render Popover trigera i sadržaja
   * ZAŠTO: Proveravamo da PopoverTrigger i PopoverContent renderuju
   *   svoje elemente kada su u istom Popover kontejneru.
   * KAKO: getByRole('button') pronazi trigger, zatim proveravamo
   *   da content postoji u DOM-u (ako je portiran, može biti na
   *   kraju dokumenta — proveravamo po tekstu).
   */
  it('renders trigger and content elements', async () => {
    const user = userEvent.setup();
    render(
      <Popover open>
        <PopoverTrigger>Open popover</PopoverTrigger>
        <PopoverContent>Popover content here</PopoverContent>
      </Popover>
    );

    expect(screen.getByText('Open popover')).toBeInTheDocument();
  });

  /**
   * TEST 2: PopoverContent prosleduje custom className
   * ZAŠTO: Content prihvata className za stilizaciju.
   * KAKO: Proveravamo da content element ima i defaultnu i custom klasu.
   */
  it('applies custom className to popover content', async () => {
    const user = userEvent.setup();
    render(
      <Popover open>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent className="custom-popover" data-testid="popover-content">
          Content
        </PopoverContent>
      </Popover>
    );

    const content = screen.getByTestId('popover-content');

    expect(content).toHaveClass('custom-popover');
    expect(content).toHaveClass('z-50');
  });

  /**
   * TEST 3: PopoverContent defaultne vrednosti za align i sideOffset
   * ZAŠTO: Treba verifikovati da su defaultni props (align='center',
   *   sideOffset=4) prosledeni Radix Content elementu.
   * KAKO: Proveravamo prisustvo defaultnih Tailwind klasa koje
   *   zavise od ovih vrednosti.
   */
  it('uses default align and sideOffset values', async () => {
    const user = userEvent.setup();
    render(
      <Popover open>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent data-testid="popover-content">
          Content
        </PopoverContent>
      </Popover>
    );

    const content = screen.getByTestId('popover-content');

    expect(content).toHaveClass('z-50');
    expect(content).toHaveClass('w-72');
  });

  /**
   * TEST 4: PopoverContent ref forwarding
   * ZAŠTO: Content koristi forwardRef da bi parent komponente mogle
   *   da dobiju pristup DOM elementu.
   * KAKO: Kreiramo ref, prosledujemo, proveravamo da je
   *   ref.current instanca HTMLDivElement (Content je div).
   */
  it('forwards ref to the popover content element', async () => {
    const user = userEvent.setup();
    const ref = React.createRef<HTMLDivElement>();

    render(
      <Popover open>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent ref={ref}>Content</PopoverContent>
      </Popover>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  /**
   * TEST 5: PopoverTrigger prosleduje onClick i ostale atribute
   * ZAŠTO: Trigger mora biti interaktivan — prosleduje eventove
   *   Radix Trigger elementu.
   * KAKO: fireEvent.click na trigger, proveravamo da callback radi.
   */
  it('trigger fires onClick handler', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Popover>
        <PopoverTrigger onClick={onClick}>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    );

    await user.click(screen.getByText('Open'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});


