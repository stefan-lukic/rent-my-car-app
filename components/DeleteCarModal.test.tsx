import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DeleteCarModal from './DeleteCarModal';
import l from '@/helper/en';

describe('DeleteCarModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  const renderModal = (overrides = {}) => {
    const props = {
      isOpen: true,
      carId: 'car-1',
      onDelete: vi.fn(),
      onClose: vi.fn(),
      ...overrides,
    };

    render(<DeleteCarModal {...props} />);
    return props;
  };

  it('does not render when closed', () => {
    renderModal({ isOpen: false });

    expect(screen.queryByText(l.cars.deleteCar)).not.toBeInTheDocument();
  });

  it('renders confirmation content when open', () => {
    renderModal();

    expect(screen.getByText(l.cars.deleteCar)).toBeInTheDocument();
    expect(screen.getByText(l.cars.deleteCarConfirm)).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: l.common.cancel })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: l.common.delete })
    ).toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', async () => {
    const user = userEvent.setup();
    const props = renderModal();

    await user.click(screen.getByRole('button', { name: l.common.cancel }));

    expect(props.onClose).toHaveBeenCalledOnce();
  });

  it('deletes the selected car and closes after successful response', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
    } as Response);

    const props = renderModal();

    await user.click(screen.getByRole('button', { name: l.common.delete }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/cars/delete-car', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: 'car-1' }),
      });
    });

    expect(props.onDelete).toHaveBeenCalledWith('car-1');
    expect(props.onClose).toHaveBeenCalledOnce();
  });

  it('disables delete button while delete request is pending', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockReturnValue(new Promise(() => {}));

    renderModal();

    await user.click(screen.getByRole('button', { name: l.common.delete }));

    expect(
      screen.getByRole('button', { name: l.common.deleting })
    ).toBeDisabled();
  });

  it('shows an inline error when delete request fails', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({}), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const props = renderModal();

    await user.click(screen.getByRole('button', { name: l.common.delete }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        l.cars.deleteCarError
      );
    });

    expect(props.onDelete).not.toHaveBeenCalled();
    expect(props.onClose).not.toHaveBeenCalled();
  });
});
