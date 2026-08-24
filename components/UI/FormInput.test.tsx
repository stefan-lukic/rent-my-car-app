import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import FormInput from './FormInput';

describe('FormInput', () => {
  it('povezuje label sa input poljem', () => {
    render(<FormInput label="Email address" name="email" type="email" />);

    const input = screen.getByLabelText('Email address');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'email');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('prikazuje poruku o gresci kada je prosledjena', () => {
    render(
      <FormInput
        label="Password"
        name="password"
        type="password"
        error="Password must contain at least 8 characters"
      />
    );

    expect(
      screen.getByText('Password must contain at least 8 characters')
    ).toBeInTheDocument();
  });
});
