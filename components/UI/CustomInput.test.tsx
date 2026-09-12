import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import CustomInput from './CustomInput';
import { authFormSchema } from '@/lib/utils';

const formSchema = authFormSchema('sign-up');

describe('CustomInput', () => {
  const renderWithForm = (
    props: Omit<Parameters<typeof CustomInput>[0], 'control'>
  ) => {
    const Wrapper = () => {
      const methods = useForm<z.infer<typeof formSchema>>({
        defaultValues: { name: '', email: '', password: '' },
      });

      return (
        <FormProvider {...methods}>
          <CustomInput {...props} control={methods.control} />
        </FormProvider>
      );
    };

    render(<Wrapper />);
  };

  it('renders label text', () => {
    renderWithForm({
      name: 'email',
      label: 'Email address',
      type: 'email',
    });

    expect(screen.getByText('Email address')).toBeInTheDocument();
  });

  it('renders input with correct type', () => {
    renderWithForm({
      name: 'name',
      label: 'Name',
      type: 'text',
    });

    const input = screen.getByLabelText('Name');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('renders input with placeholder', () => {
    renderWithForm({
      name: 'name',
      label: 'Name',
      placeholder: 'Enter your name',
      type: 'text',
    });

    const input = screen.getByLabelText('Name');
    expect(input).toHaveAttribute('placeholder', 'Enter your name');
  });

  it('keeps a visually hidden label associated with the input', () => {
    renderWithForm({
      name: 'email',
      label: 'Email address',
      type: 'email',
      visuallyHiddenLabel: true,
    });

    expect(screen.getByText('Email address')).toHaveClass('sr-only');
    expect(screen.getByLabelText('Email address')).toHaveAttribute(
      'type',
      'email'
    );
  });

  it('applies maxLength when provided', () => {
    renderWithForm({
      name: 'name',
      label: 'Name',
      type: 'text',
      maxLength: 10,
    });

    const input = screen.getByLabelText('Name');
    expect(input).toHaveAttribute('maxLength', '10');
  });

  it('does not apply maxLength when omitted', () => {
    renderWithForm({
      name: 'name',
      label: 'Name',
      type: 'text',
    });

    const input = screen.getByLabelText('Name');
    expect(input).not.toHaveAttribute('maxLength');
  });
});
