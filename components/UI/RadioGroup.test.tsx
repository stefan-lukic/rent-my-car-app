import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RadioGroup, RadioGroupItem } from './RadioGroup';

describe('RadioGroup', () => {
  it('lets the user select an enabled option', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <RadioGroup aria-label="Transmission" onValueChange={onValueChange}>
        <RadioGroupItem value="automatic" aria-label="Automatic" />
        <RadioGroupItem value="manual" aria-label="Manual" />
      </RadioGroup>
    );

    await user.click(screen.getByRole('radio', { name: 'Manual' }));

    expect(onValueChange).toHaveBeenCalledWith('manual');
    expect(screen.getByRole('radio', { name: 'Manual' })).toBeChecked();
  });

  it('does not let the user select a disabled option', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <RadioGroup aria-label="Transmission" onValueChange={onValueChange}>
        <RadioGroupItem value="automatic" aria-label="Automatic" disabled />
      </RadioGroup>
    );

    const option = screen.getByRole('radio', { name: 'Automatic' });
    await user.click(option);

    expect(option).toBeDisabled();
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
