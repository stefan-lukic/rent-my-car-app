import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AppHeader from './AppHeader';

const mocks = vi.hoisted(() => ({
  usePathname: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  usePathname: mocks.usePathname,
}));

vi.mock('@/components/OwnerProfileHeader', () => ({
  default: () => <div>Shared application header</div>,
}));

describe('AppHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each(['/sign-in', '/forgot-password', '/about', '/privacy'])(
    'keeps the purpose-built navigation for %s',
    (pathname) => {
      mocks.usePathname.mockReturnValue(pathname);

      const { container } = render(<AppHeader />);

      expect(container).toBeEmptyDOMElement();
    }
  );

  it.each(['/', '/cars/add-car', '/cars/car-1', '/profile/my-profile'])(
    'renders shared navigation for %s',
    (pathname) => {
      mocks.usePathname.mockReturnValue(pathname);

      render(<AppHeader />);

      expect(screen.getByText('Shared application header')).toBeInTheDocument();
    }
  );
});
