import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LogoutButton from './LogoutButton';

const mocks = vi.hoisted(() => ({
  signOut: vi.fn(),
}));

vi.mock('next-auth/react', () => ({
  signOut: mocks.signOut,
}));

describe('LogoutButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders logout text', async () => {
    const user = userEvent.setup();
    render(<LogoutButton />);
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });

  it('calls signOut with callbackUrl on click', async () => {
    const user = userEvent.setup();
    render(<LogoutButton />);
    await user.click(screen.getByText('Log out'));
    expect(mocks.signOut).toHaveBeenCalledWith({ callbackUrl: '/sign-in' });
  });
});
