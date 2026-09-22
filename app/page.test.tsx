import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/components/HomeSearchSection', () => ({
  default: () => <div data-testid="home-search">Search</div>,
}));

vi.mock('@/components/HowItWorksButton', () => ({
  default: () => <button type="button">How it works</button>,
}));

import Home from './page';

describe('Home', () => {
  it('renders public content together with the isolated search section', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByTestId('home-search')).toBeInTheDocument();
  });
});
