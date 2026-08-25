import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import l from '@/helper/en';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt, width, height, ...rest } = props || {};
    return React.createElement('img', { src, alt, width, height, ...rest });
  },
}));

describe('Footer', () => {
  it('renders footer with black background', () => {
    render(<Footer />);

    const footer = document.querySelector('footer');

    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('bg-black');
  });

  it('renders exclusive subscription section', () => {
    render(<Footer />);

    expect(screen.getByText(l.footer.exclusive)).toBeInTheDocument();
    expect(screen.getByText(l.footer.subscribe)).toBeInTheDocument();
    expect(screen.getByText(l.footer.get10Off)).toBeInTheDocument();
  });

  it('renders support contact links', () => {
    render(<Footer />);

    expect(screen.getByText(l.footer.support)).toBeInTheDocument();
    expect(screen.getByText(l.footer.address)).toBeInTheDocument();
    expect(screen.getByText(l.footer.email)).toBeInTheDocument();
    expect(screen.getByText(l.footer.phone)).toBeInTheDocument();
  });

  it('renders account navigation links', () => {
    render(<Footer />);

    expect(screen.getByText(l.footer.account)).toBeInTheDocument();
    expect(screen.getByText(l.footer.myAccount)).toBeInTheDocument();
    expect(screen.getByText(l.footer.loginRegister)).toBeInTheDocument();
    expect(screen.getByText(l.footer.cart)).toBeInTheDocument();
    expect(screen.getByText(l.footer.wishlist)).toBeInTheDocument();
    expect(screen.getByText(l.footer.shop)).toBeInTheDocument();
  });

  it('renders quick links section', () => {
    render(<Footer />);

    expect(screen.getByText(l.footer.quickLink)).toBeInTheDocument();
    expect(screen.getByText(l.landing.privacyPolicy)).toBeInTheDocument();
    expect(screen.getByText(l.footer.termsOfUse)).toBeInTheDocument();
    expect(screen.getByText(l.footer.faq)).toBeInTheDocument();
    expect(screen.getByText(l.footer.contact)).toBeInTheDocument();
  });

  it('renders download app section with QR code and store badges', () => {
    render(<Footer />);

    expect(screen.getByText(l.footer.downloadApp)).toBeInTheDocument();
    expect(screen.getByText(l.footer.save3WithApp)).toBeInTheDocument();
  });

  it('renders social media icons', () => {
    render(<Footer />);

    expect(screen.getByAltText('facebook')).toBeInTheDocument();
    expect(screen.getByAltText('twitter')).toBeInTheDocument();
  });

  it('renders copyright text at the bottom', () => {
    render(<Footer />);

    expect(screen.getByText(l.footer.copyrightRimel)).toBeInTheDocument();
  });
});
