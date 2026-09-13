import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import l from '@/helper/en';
import CancellationOptions from './page';

describe('CancellationOptions', () => {
  it('describes the cancellation behavior implemented by the application', () => {
    render(<CancellationOptions />);

    expect(screen.getByText(l.pages.clientCancellationWindow)).toBeVisible();
    expect(screen.getByText(l.pages.clientCancellationCutoff)).toBeVisible();
    expect(
      screen.getByText(l.pages.ownerCancellationUnavailable)
    ).toBeVisible();
    expect(screen.getByText(l.pages.paymentArrangements)).toBeVisible();

    expect(screen.queryByText(/free cancellation up to 48 hours/i)).toBeNull();
    expect(screen.queryByText(/may affect your listing/i)).toBeNull();
  });
});
