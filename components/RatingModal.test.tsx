import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RatingModal from './RatingModal';

describe('RatingModal', () => {
  it('requires car and owner ratings from a client before submitting', async () => {
    const user = userEvent.setup();
    const onSubmitted = vi.fn();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ message: 'Rating submitted' }),
    }) as never;

    render(
      <RatingModal
        rentalId="rental-1"
        reviewerRole="client"
        targetName="Stefan"
        onClose={vi.fn()}
        onSubmitted={onSubmitted}
      />
    );

    const submit = screen.getByRole('button', { name: 'Submit rating' });
    expect(submit).toBeDisabled();

    const carPicker = screen.getByRole('group', { name: 'Rate the car' });
    await user.click(
      carPicker.querySelector('button[aria-label="5 stars"]') as HTMLElement
    );
    expect(submit).toBeDisabled();

    const ownerPicker = screen.getByRole('group', {
      name: 'Rate the owner: Stefan',
    });
    await user.click(
      ownerPicker.querySelector('button[aria-label="4 stars"]') as HTMLElement
    );
    await user.click(submit);

    expect(fetch).toHaveBeenCalledWith('/api/rentals/rental-1/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ carRating: 5, ownerRating: 4 }),
    });
    expect(onSubmitted).toHaveBeenCalledWith(
      expect.objectContaining({ carRating: 5, ownerRating: 4 })
    );
  });

  it('submits a client rating from an owner', async () => {
    const user = userEvent.setup();
    const onSubmitted = vi.fn();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ message: 'Rating submitted' }),
    }) as never;

    render(
      <RatingModal
        rentalId="rental-1"
        reviewerRole="owner"
        targetName="Customer"
        onClose={vi.fn()}
        onSubmitted={onSubmitted}
      />
    );

    const picker = screen.getByRole('group', {
      name: 'Rate the client: Customer',
    });
    await user.click(
      picker.querySelector('button[aria-label="5 stars"]') as HTMLElement
    );
    await user.click(screen.getByRole('button', { name: 'Submit rating' }));

    expect(fetch).toHaveBeenCalledWith('/api/rentals/rental-1/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientRating: 5 }),
    });
    expect(onSubmitted).toHaveBeenCalledWith(
      expect.objectContaining({ clientRating: 5 })
    );
  });

  it('shows the API error and keeps the form open', async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ message: 'Already reviewed' }),
    }) as never;

    render(
      <RatingModal
        rentalId="rental-1"
        reviewerRole="owner"
        targetName="Customer"
        onClose={vi.fn()}
        onSubmitted={vi.fn()}
      />
    );

    const picker = screen.getByRole('group', {
      name: 'Rate the client: Customer',
    });
    await user.click(
      picker.querySelector('button[aria-label="5 stars"]') as HTMLElement
    );
    await user.click(screen.getByRole('button', { name: 'Submit rating' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Already reviewed'
    );
  });
});
