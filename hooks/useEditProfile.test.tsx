/**
 * useEditProfile.test.tsx
 *
 * useEditProfile hook upravlja kompletnom logikom za izmenu profila:
 *   - Inicijalizacija state-a od initialProfile prop-a
 *   - Ažuriranje name i contactInfo kroz handleInputChange
 *   - Validacija i upload slike (imagePreview, type check, size check)
 *   - Submit forme preko fetch('/api/users/me', method: 'PUT')
 *   - Redirect na /profile/my-profile i refresh nakon uspeha
 *   - Prikaz error poruka za validation i server greške
 *
 * ARHITEKTURA TESTIRANJA:
 * - Ovo je hook test — testiraju se stvarni state i grane hook-a.
 * - Koristimo renderHook + act iz React Testing Library za testiranje
 *   hookova bez UI komponente.
 * - next/navigation je mockovan da ne bismo izvodili stvarni router.
 * - fetch, alert, URL su globalno mockovani (vi.stubGlobal) da ne bismo
 *   pozivali stvarni API ili browser API-je.
 *
 * ZAŠTO OVAJ PRINCEPS:
 * - Hook test: "Da li hook ispravno validira, ažurira state, zove API
 *   i menja redirect?"
 * - Component test (EditProfileForm.test.tsx): "Da li se elementi
 *   renderuju i prosleđuju eventove hooku?"
 * - Jasna separacija = lakše debugovanje i održavanje.
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useEditProfile } from './useEditProfile';

/**
 * push i refresh: mockovi za router.push i router.refresh.
 * Značaj: useEditProfile koristi router.push('/profile/my-profile') za
 * redirect nakon uspešnog ažuriranja, i router.refresh() za osvežavanje
 * sesije. Ovi su mockovani u vi.hoisted jer next/navigation importuje
 * useRouter na top nivou.
 */
const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
}));

/**
 * Mockujemo next/navigation useRouter hook.
 * Značaj: useEditProfile koristi useRouter za push i refresh.
 * Zato ih sve vraćamo kao mockove da ne bismo izvodili stvarni Next.js routing.
 */
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mocks.push,
    refresh: mocks.refresh,
  }),
}));

/**
 * initialProfile: fiksni testni podaci za profil.
 * Značaj: Koristimo ga kao argument za useEditProfile hook.
 * Ovi podaci odražavaju stvarnu strukturu InitialProfileData iz hooka.
 */
const initialProfile = {
  name: 'Marko Markovic',
  contactInfo: '+381 60 123 4567',
  profileImage: 'https://example.com/profile.jpg',
};

/**
 * createTextChangeEvent: Helper za kreiranje ChangeEvent objekta za tekstualne inpute.
 * Značaj: useEditProfile.handleInputChange očekuje ChangeEvent<HTMLInputElement>.
 * Ovde kreiramo mock event objekat sa potrebnim poljima (target.name, target.value, target.type).
 * @param name - Ime inputa (npr. 'name', 'contactInfo')
 * @param value - Vrednost koju korisnik unosi
 * @returns Mock ChangeEvent objekat
 */
const createTextChangeEvent = (
  name: string,
  value: string
) =>
  ({
    target: {
      name,
      value,
      type: 'text',
    },
  }) as React.ChangeEvent<HTMLInputElement>;

/**
 * createFileChangeEvent: Helper za kreiranje ChangeEvent objekta za file input.
 * Značaj: useEditProfile.handleInputChange za file type očekuje
 * e.target.files[0] da bude File objekat.
 * @param file - File objekat koji korisnik "bira"
 * @returns Mock ChangeEvent objekat za file input
 */
const createFileChangeEvent = (file: File) =>
  ({
    target: {
      name: 'image',
      type: 'file',
      files: [file],
    },
  }) as unknown as React.ChangeEvent<HTMLInputElement>;

describe('useEditProfile', () => {
  /**
   * beforeEach: Restartujemo mockove i postavljamo globalne mockove.
   * Značaj: useEditProfile koristi fetch, alert i URL.createObjectURL
   * direktno, zato ih mockujemo na globalnom nivou.
   * - fetch: mockujemo da ne bismo pozivali stvarni API
   * - alert: mockujemo da ne bi prikazivali browser alertove
   * - URL.createObjectURL: mockujemo da vraća fiksni blob URL
   */
  beforeEach(() => {
    vi.clearAllMocks();

    vi.stubGlobal('fetch', vi.fn());

    vi.stubGlobal(
      'alert',
      vi.fn()
    );

    vi.stubGlobal(
      'URL',
      {
        createObjectURL: vi.fn(() => 'blob:profile-image'),
      }
    );
  });

  /**
   * TEST 1: Inicijalizacija profileData i imagePreview
   * ZAŠTO: Treba verifikovati da hook ispravno inicijalizuje state
   * od initialProfile prop-a.
   * KAKO:
   * - ProfileData.name treba da bude initialProfile.name
   * - ProfileData.contactInfo treba da bude initialProfile.contactInfo
   * - ProfileData.image treba da bude null (nema inicijalne slike)
   * - ImagePreview treba da bude initialProfile.profileImage
   * - Error treba da bude prazan string
   * - IsSubmitting treba da bude false
   */
  it('returns initial profile state', () => {
    const { result } = renderHook(() =>
      useEditProfile(initialProfile)
    );

    expect(result.current.profileData).toEqual({
      name: 'Marko Markovic',
      contactInfo: '+381 60 123 4567',
      image: null,
    });

    expect(result.current.imagePreview).toBe(
      'https://example.com/profile.jpg'
    );

    expect(result.current.error).toBe('');
    expect(result.current.isSubmitting).toBe(false);
  });

  /**
   * TEST 2: Ažuriranje name i contactInfo
   * ZAŠTO: Treba verifikovati da handleInputChange ispravno ažurira
   * profileData.name i profileData.contactInfo bez pikselnih grešaka.
   * KAKO:
   * 1. Koristimo act() za wrap-ovanje state promena (React pravilo)
   * 2. Pozivamo handleInputChange sa change event za 'name'
   * 3. Pozivamo handleInputChange sa change event za 'contactInfo'
   * 4. Proveravamo da su vrednosti ažurirane
   */
  it('updates name and contact information', () => {
    const { result } = renderHook(() =>
      useEditProfile(initialProfile)
    );

    act(() => {
      result.current.handleInputChange(
        createTextChangeEvent('name', 'Ana Jovanovic')
      );

      result.current.handleInputChange(
        createTextChangeEvent('contactInfo', '+381 61 111 2222')
      );
    });

    expect(result.current.profileData.name).toBe('Ana Jovanovic');

    expect(result.current.profileData.contactInfo).toBe(
      '+381 61 111 2222'
    );
  });

  /**
   * TEST 3: Odbijanje fajla koji nije slika
   * ZAŠTO: Hook treba da validira da izabrani fajl počinje sa 'image/'.
   * Ako ne počinje, treba da postavi error 'Please select an image file.'
   * i da ne ažurira profileData.image.
   * KAKO:
   * 1. Kreiramo File objekat sa type='application/pdf' (nije slika)
   * 2. Pozivamo handleInputChange sa ovim file-om
   * 3. Proveravamo da je error postavljen
   * 4. Proveravamo da profileData.image ostaje null
   */
  it('rejects a file that is not an image', () => {
    const { result } = renderHook(() =>
      useEditProfile(initialProfile)
    );

    const file = new File(['text'], 'document.pdf', {
      type: 'application/pdf',
    });

    act(() => {
      result.current.handleInputChange(
        createFileChangeEvent(file)
      );
    });

    expect(result.current.error).toBe(
      'Please select an image file.'
    );

    expect(result.current.profileData.image).toBeNull();
  });

  /**
   * TEST 4: Odbijanje slike veće od 5MB
   * ZAŠTO: Hook treba da validira da slika nije veća od 5 * 1024 * 1024 bytes.
   * Ako je veća, treba da postavi error 'Profile image must be smaller than 5 MB.'
   * KAKO:
   * 1. Kreiramo File objekat sa veličinom 5MB + 1 byte
   * 2. Pozivamo handleInputChange sa ovim file-om
   * 3. Proveravamo da je error postavljen
   */
  it('rejects image larger than 5 MB', () => {
    const { result } = renderHook(() =>
      useEditProfile(initialProfile)
    );

    const oversizedFile = new File(
      [new Uint8Array(5 * 1024 * 1024 + 1)],
      'large-image.png',
      { type: 'image/png' }
    );

    act(() => {
      result.current.handleInputChange(
        createFileChangeEvent(oversizedFile)
      );
    });

    expect(result.current.error).toBe(
      'Profile image must be smaller than 5 MB.'
    );
  });

  /**
   * TEST 5: Prihvatanje validne slike i generisanje preview URL-a
   * ZAŠTO: Za validnu sliku (type='image/png', manja od 5MB), hook
   * treba da postavi profileData.image i generiše imagePreview
   * preko URL.createObjectURL().
   * KAKO:
   * 1. Kreiramo validan File objekat (image/png)
   * 2. Mockujemo URL.createObjectURL da vraća 'blob:profile-image'
   * 3. Pozivamo handleInputChange sa ovim file-om
   * 4. Proveravamo da je error prazan
   * 5. Proveravamo da je profileData.image postavljen
   * 6. Proveravamo da je imagePreview postavljen na blob URL
   * 7. Proveravamo da je URL.createObjectURL pozvan sa tačnim file-om
   */
  it('accepts valid image and generates preview URL', () => {
    const { result } = renderHook(() =>
      useEditProfile(initialProfile)
    );

    const image = new File(['image'], 'profile.png', {
      type: 'image/png',
    });

    act(() => {
      result.current.handleInputChange(
        createFileChangeEvent(image)
      );
    });

    expect(result.current.error).toBe('');
    expect(result.current.profileData.image).toBe(image);
    expect(result.current.imagePreview).toBe('blob:profile-image');
    expect(URL.createObjectURL).toHaveBeenCalledWith(image);
  });

  /**
   * TEST 6: Blokiranje submit-a kada je name prazan
   * ZAŠTO: Ako korisnik pokuša da submit-uje formu bez imena,
   * handleSubmit treba da postavi error 'Full name is required.'
   * i da NE pozove fetch.
   * KAKO:
   * 1. Inicijalizujemo hook sa name: '' (prazan string)
   * 2. Pozivamo handleInputChange sa ChangeEvent koji ima
   *    preventDefault() (simuliramo form submit)
   * 3. Proveravamo da je error postavljen
   * 4. Proveravamo da fetch NIJE pozvan
   */
  it('rejects submit when name is empty', async () => {
    const { result } = renderHook(() =>
      useEditProfile({
        ...initialProfile,
        name: '',
      })
    );

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });

    expect(result.current.error).toBe('Full name is required.');
    expect(fetch).not.toHaveBeenCalled();
  });

  /**
   * TEST 7: Uspešan save i redirect
   * ZAŠTO: Ključni flow — korisnik unese validne podatke, fetch uspe,
   * i aplikacija ga redirektuje na /profile/my-profile i osvežava stranicu.
   * KAKO:
   * 1. Mockujemo fetch da vrati ok: true i { success: true }
   * 2. Inicijalizujemo hook sa validnim initialProfile
   * 3. Pozivamo handleSubmit sa ChangeEvent sa preventDefault()
   * 4. Čekamo da fetch bude pozvan sa tačnim argumentima
   *    (method: 'PUT', body: FormData)
   * 5. Proveravamo da je router.push('/profile/my-profile') pozvan
   * 6. Proveravamo da je router.refresh() pozvan
   */
  it('saves profile and redirects after successful request', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    const { result } = renderHook(() =>
      useEditProfile(initialProfile)
    );

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/users/me',
        expect.objectContaining({
          method: 'PUT',
          body: expect.any(FormData),
        })
      );
    });

    expect(mocks.push).toHaveBeenCalledWith('/profile/my-profile');
    expect(mocks.refresh).toHaveBeenCalledOnce();
  });

  /**
   * TEST 8: Server error — prikaz error poruke
   * ZAŠTO: Kada fetch vrati ok: false, hook treba da postavi error
   * sa server-om dobijenom porukom i resetuje isSubmitting na false.
   * KAKO:
   * 1. Mockujemo fetch da vrati ok: false i { message: 'Profile update failed.' }
   * 2. Pozivamo handleSubmit
   * 3. Proveravamo da je error postavljen na 'Profile update failed.'
   * 4. Proveravamo da je isSubmitting vratio na false
   */
  it('shows server error after unsuccessful request', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => ({
        message: 'Profile update failed.',
      }),
    } as Response);

    const { result } = renderHook(() =>
      useEditProfile(initialProfile)
    );

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });

    expect(result.current.error).toBe('Profile update failed.');
    expect(result.current.isSubmitting).toBe(false);
  });
});