import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CarDetailsGallery from './CarDetailsGallery';
import { createNextImageMock } from '@/test-utils/mocks/next-image';

createNextImageMock();

describe('CarDetailsGallery', () => {
  it('changes the selected image using gallery controls', async () => {
    const user = userEvent.setup();
    render(
      <CarDetailsGallery
        images={['/car-1.jpg', '/car-2.jpg']}
        carName="Mercedes C-Class"
      />
    );

    expect(
      screen.getByAltText('Mercedes C-Class, photo 1').getAttribute('src')
    ).toContain('%2Fcar-1.jpg');

    await user.click(screen.getByRole('button', { name: 'Next car photo' }));

    expect(
      screen.getByAltText('Mercedes C-Class, photo 2').getAttribute('src')
    ).toContain('%2Fcar-2.jpg');
  });

  it('uses the car placeholder when there are no photos', () => {
    render(<CarDetailsGallery images={[]} carName="Car without photos" />);

    expect(
      screen.getByAltText('Car without photos, photo 1').getAttribute('src')
    ).toContain('placeholder-car.svg');
  });
});
