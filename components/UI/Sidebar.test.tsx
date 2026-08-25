import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Sidebar from './Sidebar';
import { sidebarLinks } from '@/helper/constants';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt, width, height, ...rest } = props || {};
    return React.createElement('img', { src, alt, width, height, ...rest });
  },
}));

describe('Sidebar', () => {
  it('renders sidebar container', () => {
    const { container } = render(<Sidebar />);

    const sidebar = container.querySelector('.border-r');

    expect(sidebar).toBeInTheDocument();
  });

  it('renders all sidebar links from configuration', () => {
    render(<Sidebar />);

    for (const link of sidebarLinks) {
      expect(screen.getByText(link.label)).toBeInTheDocument();
    }
  });

  it('links have correct href attributes', () => {
    render(<Sidebar />);

    for (const link of sidebarLinks) {
      const anchor = screen.getByRole('link', {
        name: new RegExp(link.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
      });

      expect(anchor).toHaveAttribute('href', link.link);
    }
  });

  it('renders icons for sidebar items that have them', () => {
    const { container } = render(<Sidebar />);

    const itemsWithIcons = sidebarLinks.filter((item) => item.icon);

    for (const item of itemsWithIcons) {
      const anchors = screen.getAllByRole('link', {
        name: new RegExp(item.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
      });

      const anchor = anchors[0];

      const images = anchor.querySelectorAll('img');

      expect(images.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('renders correct number of sidebar links', () => {
    render(<Sidebar />);

    const links = screen.getAllByRole('link');

    expect(links.length).toBe(sidebarLinks.length);
  });
});
