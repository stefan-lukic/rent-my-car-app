/**
 * useAddCar.test.tsx
 *
 * useAddCar hook upravlja kompletnom logikom za dodavanje novog automobila:
 *   - Inicijalizacija carData state-a sa default vrednostima
 *   - Ažuriranje tekstualnih polja kroz handleInputChange
 *   - Upload i upravljanje slikama (dodavanje, uklanjanje po ID)
 *   - Ažuriranje datuma prve registracije kroz handleDateChange
 *   - Validacija pre submit-a (firstRegistration required, bar 1 slika)
 *   - Submit forme — kreiranje FormData i fetch('/api/cars/add-car')
 *   - Redirect na /profile/my-profile nakon uspeha
 *   - Error handling za neuspešan request
 *
 * ARHITEKTURA TESTIRANJA:
 * - Ovo je hook test — testiraju se stvarni state i grane hook-a.
 * - Koristimo renderHook + act iz React Testing Library.
 * - next-auth/react je mockovan da kontrolišemo autentikaciju.
 * - next/navigation je mockovan za router.push.
 * - fetch, alert, crypto su globalno mockovani (vi.stubGlobal).
 *
 * ZAŠTO OVAJ PRINCEPS:
 * - useAddCar je kompleksan hook sa mnogo state-a i logike.
 * - Zato testiramo svaki deo zasebno: state inicijalizacija,
 *   input promene, validacija, submit, error handling.
 * - Koristimo vi.hoisted() za cross-module mockove zbog bolje
 *   type safety.
 */

import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAddCar } from './useAddCar';
import l from '@/helper/en';

/**
 * mocks: cross-module mockovi za useSession i push.
 * Značaj: useAddCar koristi useSession za proveru autentikacije
 * i useRouter().push() za redirect nakon uspešnog dodavanja auta.
 *
 * vi.hoisted() je potreban jer useAddCar.tsx importuje ove module
 * na top nivou, a mock factory takođe treba pristup istim mockovima.
 */
const mocks = vi.hoisted(() => ({
  useSession: vi.fn(),
  push: vi.fn(),
}));

/**
 * Mockujemo next-auth/react useSession hook.
 * Značaj: useAddCar proverava da li je korisnik ulogovan pre nego
 * što mu dozvoli da doda auto. Ako nije ulogovan, redirektuje na /sign-in.
 */
vi.mock('next-auth/react', () => ({
  useSession: mocks.useSession,
}));

/**
 * Mockujemo next/navigation useRouter hook.
 * Značaj: useAddCar koristi router.push('/profile/my-profile') za
 * redirect nakon uspešnog dodavanja auta.
 */
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mocks.push,
  }),
}));

/**
 * createTextChangeEvent: Helper za kreiranje ChangeEvent za tekstualne inpute.
 * Značaj: useAddCar.handleInputChange očekuje ChangeEvent<HTMLInputElement>
 * za tekstualna polja. Ovde kreiramo mock event sa target.name, target.value,
 * target.type = 'text'.
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
 * createFileChangeEvent: Helper za kreiranje ChangeEvent za file input.
 * Značaj: useAddCar.handleInputChange za type='file' očekuje
 * e.target.files da bude FileList. Ovde kreiramo mock event sa
 * target.name = 'images' i target.files = [file].
 */
const createFileChangeEvent = (files: File[]) =>
  ({
    target: {
      name: 'images',
      type: 'file',
      files,
    },
  }) as unknown as React.ChangeEvent<HTMLInputElement>;

/**
 * submitEvent: Mock FormEvent za testiranje handleSubmit-a.
 * Značaj: useAddCar.handleSubmit očekuje React.FormEvent sa
 * preventDefault() metodom. Ovde kreiramo mock event.
 */
const submitEvent = {
  preventDefault: vi.fn(),
} as unknown as React.FormEvent;

describe('useAddCar', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    /**
     * Default: korisnik je ulogovan.
     * Značaj: Većina testova testiraju hook za autentifikovane
     * korisnike. Za redirect test, override-ujemo u tom testu.
     */
    mocks.useSession.mockReturnValue({
      data: {
        user: {
          id: 'user-1',
        },
      },
      status: 'authenticated',
    });

    /**
     * Globalni mockovi za fetch, alert i crypto.
     * Značaj: useAddCar koristi:
     * - fetch: za slanje FormData na /api/cars/add-car
     * - alert: za prikaz error poruka
     * - crypto.randomUUID: za generisanje ID-a slikama
     *
     * Ovi mockovi su globalni jer useAddCar ne importuje ih kao module,
     * vec koristi kao browser global API-je.
     */
    vi.stubGlobal('fetch', vi.fn());
    vi.stubGlobal('alert', vi.fn());
    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(() => 'generated-image-id'),
    });
  });

  /**
   * TEST 1: Inicijalizacija carData state-a
   * ZAŠTO: Treba verifikovati da hook ispravno postavlja početne
   * vrednosti za carData (prazni stringovi, null datum, prazan niz
   * slika) i isSubmitting/showSuccess = false.
   * KAKO:
   * - Proveravamo carData.carModel = ''
   * - Proveravamo carData.images = []
   * - Proveravamo carData.firstRegistration = null
   * - Proveravamo isSubmitting = false
   * - Proveravamo showSuccess = false
   */
  it('returns initial car form data', () => {
    const { result } = renderHook(() => useAddCar());

    expect(result.current.carData.carModel).toBe('');
    expect(result.current.carData.images).toEqual([]);
    expect(result.current.carData.firstRegistration).toBeNull();
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.showSuccess).toBe(false);
  });

  /**
   * TEST 2: Redirect za neulogovanog korisnika
   * ZAŠTO: Ako korisnik nije ulogovan (status === 'unauthenticated'),
   * useAddCar treba da ga redirektuje na /sign-in stranu.
   * KAKO:
   * 1. Override-ujemo useSession da vrati status: 'unauthenticated'
   * 2. Renderujemo hook (useEffect će se izvršiti automatski)
   * 3. Čekamo da router.push('/sign-in') bude pozvan
   */
  it('redirects unauthenticated user to sign-in page', async () => {
    mocks.useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    renderHook(() => useAddCar());

    await waitFor(() => {
      expect(mocks.push).toHaveBeenCalledWith('/sign-in');
    });
  });

  /**
   * TEST 3: Ažuriranje tekstualnih polja
   * ZAŠTO: Treba verifikovati da handleInputChange ispravno ažurira
   * carData za tekstualna polja (npr. carModel, pricePerDay).
   * KAKO:
   * 1. Pozivamo handleInputChange za carModel = 'C-Class'
   * 2. Pozivamo handleInputChange za pricePerDay = '55'
   * 3. Proveravamo da su vrednosti ažurirane u carData
   */
  it('updates text field values', () => {
    const { result } = renderHook(() => useAddCar());

    act(() => {
      result.current.handleInputChange(
        createTextChangeEvent('carModel', 'C-Class')
      );
    });

    act(() => {
      result.current.handleInputChange(
        createTextChangeEvent('pricePerDay', '55')
      );
    });

    expect(result.current.carData.carModel).toBe('C-Class');
    expect(result.current.carData.pricePerDay).toBe('55');
  });

  /**
   * TEST 4: Dodavanje i uklanjanje slika
   * ZAŠTO: Treba verifikovati da handleInputChange za type='file'
   * dodaje slike u carData.images sa generisanim ID-evima, i da
   * removeImage uklanja sliku po ID-u.
   * KAKO:
   * 1. Kreiramo File objekat za sliku
   * 2. Pozivamo handleInputChange sa [image] fajlovima
   * 3. Proveravamo da carData.images sadrži jedan element sa
   *    file i id: 'generated-image-id' (iz crypto.randomUUID mock)
   * 4. Pozivamo removeImage('generated-image-id')
   * 5. Proveravamo da carData.images ponovo bude []
   */
  it('adds selected image files and removes an image by id', () => {
    const { result } = renderHook(() => useAddCar());

    const image = new File(['car image'], 'car.jpg', {
      type: 'image/jpeg',
    });

    act(() => {
      result.current.handleInputChange(
        createFileChangeEvent([image])
      );
    });

    expect(result.current.carData.images).toEqual([
      {
        file: image,
        id: 'generated-image-id',
      },
    ]);

    act(() => {
      result.current.removeImage('generated-image-id');
    });

    expect(result.current.carData.images).toEqual([]);
  });

  /**
   * TEST 5: Ažuriranje datuma prve registracije
   * ZAŠTO: Treba verifikovati da handleDateChange ispravno ažurira
   * carData.firstRegistration.
   * KAKO:
   * 1. Kreiramo Date objekat (2022-01-01)
   * 2. Pozivamo handleDateChange sa tim datumom
   * 3. Proveravamo da je firstRegistration postavljen
   */
  it('updates first registration date', () => {
    const { result } = renderHook(() => useAddCar());

    const registrationDate = new Date('2022-01-01');

    act(() => {
      result.current.handleDateChange(registrationDate);
    });

    expect(result.current.carData.firstRegistration).toEqual(
      registrationDate
    );
  });

  /**
   * TEST 6: Blokiranje submit-a bez datuma registracije
   * ZAŠTO: Ako firstRegistration nije postavljen, handleSubmit treba
   * da prikaže alert 'First registration is required!' i ne poziva fetch.
   * KAKO:
   * 1. Pozivamo handleSubmit bez prethodnog postavljanja firstRegistration
   * 2. Proveravamo da je alert pozvan sa l.cars.firstRegistrationRequired
   * 3. Proveravamo da fetch NIJE pozvan
   * 4. Proveravamo da je isSubmitting vratio na false
   */
  it('does not submit without first registration date', async () => {
    const { result } = renderHook(() => useAddCar());

    await act(async () => {
      await result.current.handleSubmit(submitEvent);
    });

    expect(alert).toHaveBeenCalledWith(
      l.cars.firstRegistrationRequired
    );

    expect(fetch).not.toHaveBeenCalled();
    expect(result.current.isSubmitting).toBe(false);
  });

  /**
   * TEST 7: Blokiranje submit-a bez slika
   * ZAŠTO: Ako carData.images.length === 0, handleSubmit treba
   * da prikaže alert 'At least one image is required!' i ne poziva fetch.
   * KAKO:
   * 1. Postavljamo firstRegistration da prosadjujemo validaciju datuma
   * 2. Ostavljamo da images.length = 0
   * 3. Pozivamo handleSubmit
   * 4. Proveravamo da je alert pozvan sa l.cars.atLeastOneImage
   * 5. Proveravamo da fetch NIJE pozvan
   */
  it('does not submit without an image', async () => {
    const { result } = renderHook(() => useAddCar());

    act(() => {
      result.current.handleDateChange(new Date('2022-01-01'));
    });

    await act(async () => {
      await result.current.handleSubmit(submitEvent);
    });

    expect(alert).toHaveBeenCalledWith(l.cars.atLeastOneImage);
    expect(fetch).not.toHaveBeenCalled();
  });

  /**
   * TEST 8: Uspešan submit i redirect
   * ZAŠTO: Ključni flow — korisnik popuni formu, fetch uspe,
   * i hook redirektuje na /profile/my-profile.
   * KAKO:
   * 1. Mockujemo fetch da vrati ok: true
   * 2. Popunimo carModel, firstRegistration i dodamo sliku
   * 3. Pozivamo handleSubmit
   * 4. Čekamo da fetch bude pozvan za /api/cars/add-car sa FormData
   * 5. Proveravamo da je router.push('/profile/my-profile') pozvan
   * 6. Proveravamo da je showSuccess postavljen na true
   */
  it('submits FormData and redirects after successful request', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
    } as Response);

    const { result } = renderHook(() => useAddCar());

    const image = new File(['car image'], 'car.jpg', {
      type: 'image/jpeg',
    });

    act(() => {
      result.current.handleInputChange(
        createTextChangeEvent('carModel', 'C-Class')
      );

      result.current.handleDateChange(new Date('2022-01-01'));

      result.current.handleInputChange(
        createFileChangeEvent([image])
      );
    });

    await act(async () => {
      await result.current.handleSubmit(submitEvent);
    });

    expect(fetch).toHaveBeenCalledWith(
      '/api/cars/add-car',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      })
    );

    expect(mocks.push).toHaveBeenCalledWith(
      '/profile/my-profile'
    );

    expect(result.current.showSuccess).toBe(true);
  });

  /**
   * TEST 9: Error pri neuspešnom requestu
   * ZAŠTO: Ako fetch vrati ok: false, hook treba da prikaže alert
   * sa greškom i resetuje isSubmitting na false.
   * KAKO:
   * 1. Mockujemo fetch da vrati ok: false
   * 2. Postavljamo firstRegistration i sliku
   * 3. Pozivamo handleSubmit
   * 4. Proveravamo da je alert pozvan sa l.cars.failedAddCar
   * 5. Proveravamo da je isSubmitting vratio na false
   */
  it('shows error when request fails', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
    } as Response);

    const { result } = renderHook(() => useAddCar());

    const image = new File(['car image'], 'car.jpg', {
      type: 'image/jpeg',
    });

    act(() => {
      result.current.handleDateChange(new Date('2022-01-01'));

      result.current.handleInputChange(
        createFileChangeEvent([image])
      );
    });

    await act(async () => {
      await result.current.handleSubmit(submitEvent);
    });

    expect(alert).toHaveBeenCalledWith(l.cars.failedAddCar);
    expect(result.current.isSubmitting).toBe(false);
  });
});