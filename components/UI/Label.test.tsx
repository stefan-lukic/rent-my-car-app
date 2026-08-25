import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  it('renders an input with placeholder and default classes', () => {
    render(<Input placeholder="Email" data-testid="input" />);

    const input = screen.getByPlaceholderText('Email');

    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('h-10');
    expect(input).toHaveClass('w-full');
  });

  it('merges custom className with default classes', () => {
    render(<Input className="custom-class" data-testid="input" />);

    const input = screen.getByTestId('input');

    expect(input).toHaveClass('w-full');
    expect(input).toHaveClass('custom-class');
  });

  it('forwards ref to the native input element', () => {
    const ref = React.createRef<HTMLInputElement>();

    render(<Input ref={ref} data-testid="input" />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.tagName).toBe('INPUT');
  });

  it('passes type attribute to the native input', () => {
    const { rerender } = render(<Input type="email" data-testid="input" />);

    expect(screen.getByTestId('input')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" data-testid="input" />);

    expect(screen.getByTestId('input')).toHaveAttribute('type', 'password');
  });

  it('supports disabled state', () => {
    render(<Input disabled data-testid="input" />);

    const input = screen.getByTestId('input');

    expect(input).toBeDisabled();
  });
});
