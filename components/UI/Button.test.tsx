import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('prikazuje tekst i koristi podrazumevani izgled', async () => {
    const user = userEvent.setup();
    render(<Button>Save car</Button>);

    const button = screen.getByRole('button', {
      name: 'Save car',
    });

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-brand');
    expect(button).toHaveClass('h-10');
  });

  it('poziva prosledjenu funkciju kada korisnik klikne', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Save car</Button>);

    await user.click(screen.getByRole('button', { name: 'Save car' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('dobija disabled stanje i danger varijantu', async () => {
    const user = userEvent.setup();
    render(
      <Button disabled variant="danger">
        Delete car
      </Button>
    );

    const button = screen.getByRole('button', {
      name: 'Delete car',
    });

    expect(button).toBeDisabled();
    expect(button).toHaveClass('bg-[var(--button)]');
  });
});
