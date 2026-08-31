import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CarBookingPanel from './CarBookingPanel';

vi.mock('react-datepicker', () => ({
  default: ({ selected, onChange, placeholderText }: any) => (
    <input
      aria-label={placeholderText}
      value={
        selected
          ? `${selected.getFullYear()}-${String(selected.getMonth() + 1).padStart(2, '0')}-${String(selected.getDate()).padStart(2, '0')}`
          : ''
      }
      onChange={(event) => {
        const [year, month, day] = event.target.value.split('-').map(Number);
        onChange(new Date(year, month - 1, day));
      }}
    />
  ),
}));

const defaultProps = {
  carId: 'car-1',
  carName: 'Mercedes C-Class',
  pricePerDay: 50,
  bookedPeriods: [],
  today: '2026-08-25T00:00:00.000Z',
};

describe('CarBookingPanel', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows the trip cancellation, payment and distance terms', () => {
    render(<CarBookingPanel {...defaultProps} />);

    expect(screen.getByText('Flexible cancellation')).toBeInTheDocument();
    expect(screen.getByText('Pay in person')).toBeInTheDocument();
    expect(screen.getByText('Unlimited')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'View cancellation policy' })
    ).toHaveAttribute('href', '/cancellation');
  });

  it('calculates the inclusive booking price', () => {
    render(<CarBookingPanel {...defaultProps} />);

    fireEvent.change(screen.getByLabelText('Select pickup'), {
      target: { value: '2026-09-01' },
    });
    fireEvent.change(screen.getByLabelText('Select return'), {
      target: { value: '2026-09-03' },
    });

    expect(screen.getByText('3 days')).toBeInTheDocument();
    expect(screen.getByText('€150')).toBeInTheDocument();
  });

  it('creates a booking and links to My Rentals', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'Booking successful' }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      })
    );
    render(<CarBookingPanel {...defaultProps} />);

    fireEvent.change(screen.getByLabelText('Select pickup'), {
      target: { value: '2026-09-01' },
    });
    fireEvent.change(screen.getByLabelText('Select return'), {
      target: { value: '2026-09-03' },
    });
    await user.click(screen.getByRole('button', { name: 'Book Now' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/book-now',
      expect.objectContaining({ method: 'POST' })
    );
    expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toEqual({
      carId: 'car-1',
      startDate: '2026-09-01',
      endDate: '2026-09-03',
    });
    expect(
      await screen.findByRole('link', { name: 'View My Rentals' })
    ).toHaveAttribute('href', '/profile/my-profile');
  });

  it('keeps URL calendar dates unchanged in the booking payload', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'Booking successful' }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    render(
      <CarBookingPanel
        {...defaultProps}
        initialStartDate="2026-09-10"
        initialEndDate="2026-09-12"
      />
    );

    expect(screen.getByLabelText('Select pickup')).toHaveValue('2026-09-10');
    expect(screen.getByLabelText('Select return')).toHaveValue('2026-09-12');
    expect(screen.getByText('3 days')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Book Now' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toEqual({
      carId: 'car-1',
      startDate: '2026-09-10',
      endDate: '2026-09-12',
    });
  });

  it('blocks a period that overlaps an existing booking', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.spyOn(global, 'fetch');
    render(
      <CarBookingPanel
        {...defaultProps}
        bookedPeriods={[
          {
            startDate: '2026-09-02T00:00:00.000Z',
            endDate: '2026-09-04T00:00:00.000Z',
          },
        ]}
      />
    );

    fireEvent.change(screen.getByLabelText('Select pickup'), {
      target: { value: '2026-09-01' },
    });
    fireEvent.change(screen.getByLabelText('Select return'), {
      target: { value: '2026-09-03' },
    });
    await user.click(screen.getByRole('button', { name: 'Book Now' }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByText(/include an unavailable day/i)).toBeInTheDocument();
  });

  it('offers sign in when the booking API returns unauthorized', async () => {
    const user = userEvent.setup();
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    );
    render(<CarBookingPanel {...defaultProps} />);

    fireEvent.change(screen.getByLabelText('Select pickup'), {
      target: { value: '2026-09-01' },
    });
    fireEvent.change(screen.getByLabelText('Select return'), {
      target: { value: '2026-09-03' },
    });
    await user.click(screen.getByRole('button', { name: 'Book Now' }));

    expect(
      await screen.findByRole('link', { name: 'Go to sign in' })
    ).toHaveAttribute('href', '/sign-in');
  });
});
