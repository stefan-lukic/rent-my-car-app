import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders a checkbox input', () => {
    render(<Checkbox aria-label="Accept terms" />);

    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });
    expect(checkbox).toBeInTheDocument();
  });

  it('renders as unchecked by default', () => {
    render(<Checkbox aria-label="accept" />);

    const checkbox = screen.getByRole('checkbox', { name: 'accept' });
    expect(checkbox).not.toBeChecked();
  });

  it('can be checked when controlled', () => {
    const { rerender } = render(
      <Checkbox checked={false} aria-label="accept" />
    );

    const checkbox = screen.getByRole('checkbox', { name: 'accept' });
    expect(checkbox).not.toBeChecked();

    rerender(<Checkbox checked={true} aria-label="accept" />);
    expect(checkbox).toBeChecked();
  });

  it('supports disabled state', () => {
    render(<Checkbox disabled aria-label="accept" />);

    const checkbox = screen.getByRole('checkbox', { name: 'accept' });
    expect(checkbox).toBeDisabled();
  });
});
