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

  it('renders table caption', () => {
    render(
      <Table>
        <TableCaption>Car List</TableCaption>
      </Table>
    );

    expect(screen.getByText('Car List')).toBeInTheDocument();
  });

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
