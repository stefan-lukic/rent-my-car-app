/**
 * MobileUserProfileInfoCard.test.tsx
 *
 * MobileUserProfileInfoCard komponenta prikazuje informacije o korisniku
 * na mobilnom profilu: ime, email, broj automobila, iznajmljivanja i rating.
 *
 * ARHITEKTURA TESTIRANJA:
 * - Ovo je komponenta test — testiraju se UI elementi i props rendering.
 * - MobileUserProfileInfoCard je "presentational" komponenta — prima
 *   sve podatke kroz props i nema spoljnih zavisnosti (osim next/image
 *   i next/link).
 * - Zato mockujemo next/image i next/link.
 *
 * ZAŠTO OVAJ PRINCEPS:
 * - MobileUserProfileInfoCard nema hookova ni API poziva — samo
 *   renderuje podatke.
 * - Zato testiramo: renderovanje korisnickih informacija, statistika,
 *   i link za edit profil.
 */

import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MobileProfileUserInfoCard from './MobileUserProfileInfoCard';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt, width, height, ...rest } = props || {};
    return React.createElement('img', { src, alt, width, height, ...rest });
  },
}));

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => (
    <a href={href}>{children}</a>
  ),
}));

const mockUser = {
  name: 'Marko Markovic',
  email: 'marko@example.com',
  contactInfo: '+381 60 123 4567',
  images: ['/avatar.jpg'],
  createdAt: new Date('2024-01-15T00:00:00.000Z'),
  rating: 4.8,
};

describe('MobileUserProfileInfoCard', () => {
  const defaultProps = {
    user: mockUser,
    carsCount: 3,
    rentalsCount: 5,
  };

  it('renders user name', () => {
    render(<MobileProfileUserInfoCard {...defaultProps} />);
    expect(screen.getByText('Marko Markovic')).toBeInTheDocument();
  });

  it('renders user contact info when available', () => {
    render(<MobileProfileUserInfoCard {...defaultProps} />);
    expect(screen.getByText('+381 60 123 4567')).toBeInTheDocument();
  });

  it('renders no phone number message when contactInfo is missing', () => {
    const userWithoutPhone = { ...mockUser, contactInfo: undefined };
    render(
      <MobileProfileUserInfoCard {...defaultProps} user={userWithoutPhone} />
    );

    expect(screen.getByText('No phone number added')).toBeInTheDocument();
  });

  it('renders member since text', () => {
    render(<MobileProfileUserInfoCard {...defaultProps} />);
    expect(screen.getByText(/Member since/)).toBeInTheDocument();
  });

  it('renders cars count', () => {
    render(<MobileProfileUserInfoCard {...defaultProps} />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Cars')).toBeInTheDocument();
  });

  it('renders rentals count', () => {
    render(<MobileProfileUserInfoCard {...defaultProps} />);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Rentals')).toBeInTheDocument();
  });

  it('renders rating with one decimal', () => {
    render(<MobileProfileUserInfoCard {...defaultProps} />);
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('Rating')).toBeInTheDocument();
  });

  it('renders rating as 0.0 when no rating is provided', () => {
    const userWithoutRating = { ...mockUser, rating: undefined };
    render(
      <MobileProfileUserInfoCard {...defaultProps} user={userWithoutRating} />
    );

    expect(screen.getByText('0.0')).toBeInTheDocument();
  });

  it('renders edit profile link', () => {
    render(<MobileProfileUserInfoCard {...defaultProps} />);
    expect(screen.getByRole('link', { name: '✎' })).toHaveAttribute(
      'href',
      '/profile/edit'
    );
  });

  it('renders user avatar image', () => {
    render(<MobileProfileUserInfoCard {...defaultProps} />);
    expect(screen.getByRole('img', { name: 'Marko Markovic' })).toHaveAttribute(
      'src',
      '/avatar.jpg'
    );
  });

  it('uses placeholder when no images are available', () => {
    const userWithoutImages = { ...mockUser, images: [] };
    render(
      <MobileProfileUserInfoCard {...defaultProps} user={userWithoutImages} />
    );

    expect(screen.getByRole('img', { name: 'Marko Markovic' })).toHaveAttribute(
      'src',
      '/placeholder-user.svg'
    );
  });
});