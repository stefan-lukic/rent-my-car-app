import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import GooglePlacesScript from './GooglePlacesScript';

vi.mock('next/script', () => ({
  default: ({ strategy, ...props }: { strategy?: string }) => (
    <script data-strategy={strategy} {...props} />
  ),
}));

describe('GooglePlacesScript', () => {
  afterEach(() => {
    delete process.env.NEXT_GOOGLE_MAPS_PLACES_API_KEY;
  });

  it('keeps autocomplete disabled when the server key is missing', () => {
    const { container } = render(<GooglePlacesScript />);

    expect(
      container.querySelector('#rentmycar-google-places-config')
    ).toHaveAttribute('data-enabled', 'false');
    expect(container.querySelector('script')).not.toBeInTheDocument();
  });

  it('renders the Places script from the server environment', () => {
    process.env.NEXT_GOOGLE_MAPS_PLACES_API_KEY = 'server-key';

    const { container } = render(<GooglePlacesScript />);
    const script = container.querySelector('script');

    expect(
      container.querySelector('#rentmycar-google-places-config')
    ).toHaveAttribute('data-enabled', 'true');
    expect(script).toHaveAttribute(
      'src',
      expect.stringContaining('key=server-key')
    );
    expect(script).toHaveAttribute('src', expect.stringContaining('places'));
    expect(script).toHaveAttribute('data-strategy', 'lazyOnload');
  });
});
