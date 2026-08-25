import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Textarea } from './TextArea';

describe('TextArea', () => {
  it('renders a textarea with placeholder and default classes', () => {
    render(<Textarea placeholder="Enter description" data-testid="textarea" />);

    const textarea = screen.getByPlaceholderText('Enter description');

    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('placeholder', 'Enter description');
    expect(textarea).toHaveClass('min-h-[80px]');
    expect(textarea).toHaveClass('w-full');
  });

  it('merges custom className with default classes', () => {
    render(<Textarea className="custom-class" data-testid="textarea" />);

    const textarea = screen.getByTestId('textarea');

    expect(textarea).toHaveClass('w-full');
    expect(textarea).toHaveClass('custom-class');
  });

  it('forwards ref to the native textarea element', () => {
    const ref = React.createRef<HTMLTextAreaElement>();

    render(<Textarea ref={ref} data-testid="textarea" />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    expect(ref.current?.tagName).toBe('TEXTAREA');
  });

  it('passes native HTML attributes to the textarea element', () => {
    render(
      <Textarea
        id="description"
        name="description"
        disabled
        data-testid="textarea"
      />
    );

    const textarea = screen.getByTestId('textarea');

    expect(textarea).toHaveAttribute('id', 'description');
    expect(textarea).toHaveAttribute('name', 'description');
    expect(textarea).toBeDisabled();
  });
});
