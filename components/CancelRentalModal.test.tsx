import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import CancelRentalModal from './CancelRentalModal';
import l from '@/helper/en';

describe('CancelRentalModal', () => {
  const renderModal = (isOpen = true) => {
    const props = {
      isOpen,
      rentalId: 'rental-1',
      onCancelled: vi.fn(),
      onClose: vi.fn(),
    };

    render(<CancelRentalModal {...props} />);
    return props;
  };

  it('does not render when closed', () => {
    renderModal(false);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders an accessible dialog and closes with Escape', async () => {
    const user = userEvent.setup();
    const props = renderModal();

    const dialog = screen.getByRole('dialog', {
      name: l.booking.cancelReservation,
    });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveFocus();

    await user.keyboard('{Escape}');

    expect(props.onClose).toHaveBeenCalledOnce();
  });
});
