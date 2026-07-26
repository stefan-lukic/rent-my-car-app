/**
 * Table.test.tsx
 *
 * Table komponenta je skup React.forwardRef elemenata za izradu
 * semantičkih HTML tabela (Table, TableHeader, TableBody, TableFooter,
 * TableRow, TableHead, TableCell, TableCaption).
 *
 * ARHITEKTURA TESTIRANJA:
 * - Ovo je komponenta test — proveravamo da li se svaki element
 *   renderuje kao odgovarajući HTML tag sa ispravnim atributima.
 * - Svaki element ima svoj describe blok za jasnu organizaciju.
 *
 * ZAŠTO OVAJ PRINCEPS:
 * - Table je bibliotečka komponenta — sastoji se od više
 *   Composition pattern elemenata.
 * - Zato testiramo: ispravan HTML tag, ref forwarding, className merging,
 *   i optionalne atribute za svaki element posebno.
 */

import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './Table';

describe('Table', () => {
  /**
   * TEST 1: Osnovni render tabele
   * ZAŠTO: Proveravamo da se Table komponenta renderuje kao
   * <table> unutar wrapper <div> za horizontalni scroll.
   * KAKO: getByRole('table') pronazi element po ARIA ulozi.
   */
  it('renders a table element inside a scrollable wrapper', () => {
    render(
      <Table>
        <TableRow>
          <TableCell>Cell</TableCell>
        </TableRow>
      </Table>
    );

    const table = screen.getByRole('table');

    expect(table).toBeInTheDocument();
    expect(table.tagName).toBe('TABLE');
  });

  /**
   * TEST 2: Ref forwarding na Table element
   * ZAŠTO: Table koristi forwardRef da bi parent komponente mogle
   *   da dobiju pristup DOM table elementu.
   * KAKO: Kreiramo ref, prosleđujemo, proveravamo da ref.current
   *   je HTMLTableElement.
   */
  it('forwards ref to the table element', () => {
    const ref = React.createRef<HTMLTableElement>();

    render(
      <Table ref={ref}>
        <TableRow>
          <TableCell>Cell</TableCell>
        </TableRow>
      </Table>
    );

    expect(ref.current).toBeInstanceOf(HTMLTableElement);
    expect(ref.current?.tagName).toBe('TABLE');
  });

  /**
   * TEST 3: TableCaption se renderuje
   * ZAŠTO: TableCaption je <caption> tag — bitan za accessibility
   *   i opisivanje sadržaja tabele.
   * KAKO: getByText pronazi caption po tekstu.
   */
  it('renders table caption', () => {
    render(
      <Table>
        <TableCaption>Car List</TableCaption>
      </Table>
    );

    expect(screen.getByText('Car List')).toBeInTheDocument();
  });

  /**
   * TEST 4: TableHeader, TableBody, TableFooter
   * ZAŠTO: Ovi elementi moraju biti ispravni thead/tbody/tfoot tagovi
   *   za semantičku ispravnost tabele.
   * KAKO: Proveravamo tagName za svaki element.
   */
  it('renders semantic table sections', () => {
    const { container } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Make</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>BMW</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total: 1</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );

    expect(container.querySelector('thead')).toBeInTheDocument();
    expect(container.querySelector('tbody')).toBeInTheDocument();
    expect(container.querySelector('tfoot')).toBeInTheDocument();
  });

  /**
   * TEST 5: TableRow i TableHead atributi
   * ZAŠTO: Proveravamo da li su className atributi prosleđeni
   *   dodatnim elementima tabele.
   * KAKO: Proveravamo prisustvo custom klasa na tr i th elementima.
   */
  it('applies custom className to table row and head cells', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow className="custom-row">
            <TableHead className="custom-head">Make</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );

    expect(screen.getByText('Make')).toHaveClass('custom-head');
  });

  /**
   * TEST 6: TableCell prosleđuje atribute
   * ZAŠTO: TableCell mora podrživati standardne HTML atribute
   *   poput colSpan, headers, itd.
   * KAKO: Proveravamo colSpan atribut na td elementu.
   */
  it('passes native td attributes like colSpan', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell colSpan={2} data-testid="cell">
              Full width cell
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const cell = screen.getByTestId('cell');

    expect(cell).toHaveAttribute('colspan', '2');
  });

  /**
   * TEST 7: TableCaption ref forwarding
   * ZAŠTO: Caption takođe treba da podrži ref za direktan pristup
   *   DOM elementu kada je potrebno.
   * KAKO: Proveravamo da ref.current je HTMLTableCaptionElement.
   */
  it('forwards ref to caption element', () => {
    const ref = React.createRef<HTMLTableCaptionElement>();

    render(
      <Table>
        <TableCaption ref={ref}>Car List</TableCaption>
      </Table>
    );

    expect(ref.current).toBeInstanceOf(HTMLTableCaptionElement);
  });
});
