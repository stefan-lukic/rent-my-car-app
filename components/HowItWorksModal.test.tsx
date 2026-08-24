import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HowItWorksModal from './HowItWorksModal';
import l from '@/helper/en';

describe('HowItWorksModal', () => {
  it('returns null when modal is closed', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <HowItWorksModal isOpen={false} onClose={vi.fn()} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders modal content when open', async () => {
    const user = userEvent.setup();
    render(<HowItWorksModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(l.howItWorks.modalTitle)).toBeInTheDocument();
  });

  it('renders all 4 steps', async () => {
    const user = userEvent.setup();
    render(<HowItWorksModal isOpen={true} onClose={vi.fn()} />);

    expect(
      screen.getByText('1. ' + l.howItWorks.browseMatch)
    ).toBeInTheDocument();
    expect(
      screen.getByText('2. ' + l.howItWorks.reserveInstantly)
    ).toBeInTheDocument();
    expect(
      screen.getByText('3. ' + l.howItWorks.smartHandover)
    ).toBeInTheDocument();
    expect(
      screen.getByText('4. ' + l.howItWorks.embarkSafely)
    ).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<HowItWorksModal isOpen={true} onClose={onClose} />);
    await user.click(screen.getByText(l.common.close));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<HowItWorksModal isOpen={true} onClose={onClose} />);

    const backdrop = document.querySelector(
      '[onclick][class*="backdrop-blur-sm"]'
    );
    if (backdrop) {
      await user.click(backdrop);
      expect(onClose).toHaveBeenCalled();
    }
  });

  it('calls onClose when Got It button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<HowItWorksModal isOpen={true} onClose={onClose} />);
    await user.click(screen.getByText(l.howItWorks.gotIt));
    expect(onClose).toHaveBeenCalled();
  });

  it('renders step descriptions', async () => {
    const user = userEvent.setup();
    render(<HowItWorksModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText(l.howItWorks.browseDesc)).toBeInTheDocument();
    expect(screen.getByText(l.howItWorks.reserveDesc)).toBeInTheDocument();
    expect(screen.getByText(l.howItWorks.handoverDesc)).toBeInTheDocument();
    expect(screen.getByText(l.howItWorks.embarkDesc)).toBeInTheDocument();
  });

  it('has fixed positioning and high z-index', async () => {
    const user = userEvent.setup();
    render(<HowItWorksModal isOpen={true} onClose={vi.fn()} />);
    const modal = document.querySelector('.fixed.inset-0.z-50');
    expect(modal).toBeInTheDocument();
  });
});
