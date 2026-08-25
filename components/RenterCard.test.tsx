import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RenterCard from './RenterCard';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt, width, height, ...rest } = props || {};
    return React.createElement('img', { src, alt, width, height, ...rest });
  },
}));

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

const mockRenterWithImage = {
  _id: 'renter-1',
  name: 'Marko Markovic',
  rating: 4.5,
  images: ['/avatar.jpg'],
  profilePicture: '/avatar.jpg',
};

const mockRenterWithoutImage = {
  _id: 'renter-2',
  name: 'Ana Jovanovic',
  rating: 0,
  images: [],
  profilePicture: '',
};

describe('RenterCard', () => {
  it('renders renter name', () => {
    render(<RenterCard renter={mockRenterWithImage} />);

    expect(screen.getByText('Marko Markovic')).toBeInTheDocument();
  });

  it('renders profile image when provided', () => {
    render(<RenterCard renter={mockRenterWithImage} />);

    const profileImage = screen.getByRole('img', { name: 'Marko Markovic' });

    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute('src', '/avatar.jpg');
  });

  it('renders initials fallback when no profile image exists', () => {
    render(<RenterCard renter={mockRenterWithoutImage} />);

    expect(screen.getByText('AJ')).toBeInTheDocument();
  });

  it('clips initials to first 2 characters', () => {
    const longNameRenter = {
      ...mockRenterWithoutImage,
      name: 'Marko Antun Markovic',
    };

    render(<RenterCard renter={longNameRenter} />);

    expect(screen.getByText('MA')).toBeInTheDocument();
  });

  it('renders rating when greater than 0', () => {
    render(<RenterCard renter={mockRenterWithImage} />);

    expect(screen.getByLabelText('Rating')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('hides rating when rating is 0', () => {
    render(<RenterCard renter={mockRenterWithoutImage} />);

    expect(screen.queryByText('0.0')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Rating')).not.toBeInTheDocument();
  });

  it('links to the renter profile page', () => {
    render(<RenterCard renter={mockRenterWithImage} />);

    const link = screen.getByRole('link', { name: /Marko Markovic/ });

    expect(link).toHaveAttribute('href', '/profile/renter-1');
  });

  it('converts initials to uppercase', () => {
    const lowerCaseRenter = {
      ...mockRenterWithoutImage,
      name: 'marko markovic',
    };

    render(<RenterCard renter={lowerCaseRenter} />);

    expect(screen.getByText('MM')).toBeInTheDocument();
  });
});
