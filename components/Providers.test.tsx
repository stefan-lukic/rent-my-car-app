import React from 'react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Providers } from './Providers';

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({}),
      } as Response)
    )
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Providers', () => {
  it('renders children inside SessionProvider', () => {
    render(
      <Providers>
        <span data-testid="child">App content</span>
      </Providers>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('App content')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <Providers>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </Providers>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByTestId('child-3')).toBeInTheDocument();
  });

  it('handles undefined children gracefully', () => {
    const { container } = render(<Providers>{undefined}</Providers>);

    expect(container.innerHTML).not.toBe('undefined');
  });
});
