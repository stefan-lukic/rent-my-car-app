import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import EditProfileForm from './EditProfileForm';

/**
 * back: mock za router.back() - koristi se za "Cancel" dugme.
 * Znacaj: EditProfileForm poziva router.back() kada korisnik odustane.
 */
/**
 * handleInputChange: mock za hook-ovu funkciju koja azurira profileData.
 * Znacaj: Svi input change event-ovi u formi moraju da produ kroz ovu
 * funkciju da bi hook znao sta se promenilo.
 */
const handleInputChange = vi.fn();

/**
 * handleSubmit: mock za hook-ovu funkciju koja salje podatke na server.
 * Znacaj: Form submit mora da prosledi event kroz hook-ov handleSubmit.
 */
const handleSubmit = vi.fn((event: React.FormEvent) => {
  event.preventDefault();
});

/**
 * useEditProfileMock: centralni mock za ceo hook.
 * Znacaj: Kroz beforeEach ili unutar testa, kontrolisemo sta hook vraca
 * (profileData, imagePreview, isSubmitting, error, itd.) kako bismo
 * simulirali razlicite stanja komponente.
 */
const useEditProfileMock = vi.fn();

/**
 * Mockujemo next/navigation useRouter hook.
 * Znacaj: EditProfileForm koristi router.back() za Cancel dugme.
 * Mockujemo da ne bismo izvodili stvarni browser history.
 */
/**
 * Mockujemo useEditProfile hook.
 * Znacaj: Testiramo komponentu, ne hook. Zato vracamo kontrolisane
 * vrednosti i proveravamo da komponenta ispravno renderuje i salje
 * eventove nazad hooku.
 */
vi.mock('@/hooks/useEditProfile', () => ({
  useEditProfile: (initialProfile: unknown) =>
    useEditProfileMock(initialProfile),
}));

/**
 * initialProfile: fiksni testni podaci za profil.
 * Znacaj: Koristimo ga kao prop za EditProfileForm i kao referencu
 * za ocekivane vrednosti u renderovanoj formi.
 */
const initialProfile = {
  name: 'Marko Markovic',
  email: 'marko@example.com',
  contactInfo: '+381 60 123 4567',
  profileImage: 'https://example.com/profile.jpg',
};

describe('EditProfileForm', () => {
  /**
   * beforeEach: Restartujemo mockove pre svakog testa i postavljamo
   * default return vrednost za useEditProfileMock.
   * Ovo osigurava da svaki test pocne sa cistim stanjem.
   */
  beforeEach(() => {
    vi.clearAllMocks();

    useEditProfileMock.mockReturnValue({
      profileData: {
        name: 'Marko Markovic',
        contactInfo: '+381 60 123 4567',
        image: null,
      },
      imagePreview: 'https://example.com/profile.jpg',
      isSubmitting: false,
      error: '',
      handleInputChange,
      handleSubmit,
    });
  });

  /**
   * TEST 1: Renderovanje pocetnih podataka profila
   * ZASTO: Proveravamo da komponenta ispravno prikaze ime, kontakt,
   * email i profilnu sliku na osnovu initialProfile prop-a.
   */
  it('renders initial profile data and preview image', async () => {
    render(<EditProfileForm initialProfile={initialProfile} />);

    expect(
      screen.getByRole('heading', {
        name: 'Make your profile feel like you.',
      })
    ).toBeInTheDocument();

    expect(screen.getByLabelText('Full Name')).toHaveValue('Marko Markovic');

    expect(screen.getByLabelText('Phone or Contact')).toHaveValue(
      '+381 60 123 4567'
    );

    expect(screen.getByLabelText('Email')).toHaveValue('marko@example.com');

    expect(screen.getByLabelText('Email')).toBeDisabled();

    expect(
      screen.getByRole('img', { name: 'Profile preview' })
    ).toHaveAttribute('src', 'https://example.com/profile.jpg');
  });

  /**
   * TEST 2: Prosledivanje promena tekstualnih polja hooku
   *
   * ZASTO JE OVDE ISPRAVKA:
   * `user.type()` simulira kucanje SLOVO PO SLOVO (kao pravi korisnik
   * na tastaturi). Za "Ana Jovanovic" (13 karaktera) to znaci 13 zasebnih
   * onChange eventova - i svaki od njih zove handleInputChange.
   *
   * To NIJE bag u komponenti, to je ocekivano ponasanje kontrolisanog
   * inputa. Zato je originalni test (`toHaveBeenCalledOnce()`) bio
   * pogresno napisan - proveravamo samo DA LI je funkcija pozvana,
   * a ne tacan broj puta (jer taj broj zavisi od duzine teksta i lako
   * moze da se "polomi" ako neko promeni test string).
   */
  it('forwards text field changes to the profile hook', async () => {
    const user = userEvent.setup();
    render(<EditProfileForm initialProfile={initialProfile} />);

    await user.type(screen.getByLabelText('Full Name'), 'Ana Jovanovic');

    expect(handleInputChange).toHaveBeenCalled();
  });

  /**
   * TEST 3: Prosledivanje izbora slike hooku
   *
   * ZASTO JE OVDE ISPRAVKA:
   * `user.upload(fileInput, [])` znaci "korisnik je izabrao NULA fajlova".
   * Kad nema fajla, input nema sta da promeni, pa se onChange event
   * uopste ne pokrece - zato je handleInputChange bio pozvan 0 puta.
   *
   * Resenje: proslediti STVARNI (mock) fajl koji smo vec kreirali
   * (promenljiva `image`), tako da postoji nesto sto se stvarno "uploaduje".
   */
  it('forwards image selection to the profile hook', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <EditProfileForm initialProfile={initialProfile} />
    );

    const fileInput = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    const image = new File(['image-content'], 'profile.png', {
      type: 'image/png',
    });

    await user.upload(fileInput, image);

    expect(handleInputChange).toHaveBeenCalled();
  });

  /**
   * TEST 4: Submit preko hook-a
   */
  it('submits through the profile hook', async () => {
    const user = userEvent.setup();
    render(<EditProfileForm initialProfile={initialProfile} />);

    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(handleSubmit).toHaveBeenCalledOnce();
  });

  /**
   * TEST 5: Prikaz error poruke iz hook-a
   */
  it('shows hook error message', async () => {
    useEditProfileMock.mockReturnValue({
      profileData: {
        name: 'Marko Markovic',
        contactInfo: '+381 60 123 4567',
        image: null,
      },
      imagePreview: '',
      isSubmitting: false,
      error: 'Full name is required.',
      handleInputChange,
      handleSubmit,
    });

    render(<EditProfileForm initialProfile={initialProfile} />);

    expect(screen.getByText('Full name is required.')).toBeInTheDocument();
  });

  /**
   * TEST 6: Disabled "Save Changes" button dok se salje
   */
  it('disables save button while submitting', async () => {
    useEditProfileMock.mockReturnValue({
      profileData: {
        name: 'Marko Markovic',
        contactInfo: '+381 60 123 4567',
        image: null,
      },
      imagePreview: '',
      isSubmitting: true,
      error: '',
      handleInputChange,
      handleSubmit,
    });

    render(<EditProfileForm initialProfile={initialProfile} />);

    expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();
  });

  /**
   * TEST 7: Cancel dugme poziva router.back()
   */
  it('links back to My Profile when Cancel is clicked', async () => {
    render(<EditProfileForm initialProfile={initialProfile} />);

    expect(screen.getByRole('link', { name: 'Cancel' })).toHaveAttribute(
      'href',
      '/profile/my-profile'
    );
  });
});
