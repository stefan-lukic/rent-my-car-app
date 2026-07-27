import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ICar } from '@/lib/model/car/Car';
import UpdateCarModal from './UpdateCarModal';
import l from '@/helper/en';

/**
 * car: fiksni testni podaci za automobil koji se azurira.
 * Znacaj: Koristimo ga kao prop za UpdateCarModal i kao referencu
 * za ocekivane vrednosti u renderovanoj formi.
 * ICar type osigurava da su svi Required polja prisutna.
 */
const car = {
  _id: 'car-1',
  make: 'BMW',
  carModel: 'X5',
  engine: 'DIESEL',
  power: '250',
  carType: 'SUV',
  city: 'Belgrade',
  carLocation: 'New Belgrade',
  averageConsumption: '7.5',
  pricePerDay: 90,
  description: 'Family SUV',
} as ICar;

describe('UpdateCarModal', () => {
  /**
   * beforeEach: Restartujemo mockove i postavljamo globalne mockove.
   * Znacaj: UpdateCarModal koristi direktno fetch i alert, zato ih
   * mockujemo na globalnom nivou.
   */
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', vi.fn());
    vi.stubGlobal('alert', vi.fn());
  });

  /**
   * renderModal: Helper funkcija za renderovanje modala sa zadatim props.
   * Znacaj: Uspostavlja konzistentan setup za sve testove, pruza
   * pristup props-ima za proveru callback-ova.
   * @param overrides - Opcioni props koji override-uju defaultne vrednosti
   * @returns props objekat za proveru callback-ova u testovima
   */
  const renderModal = (overrides = {}) => {
    const props = {
      isOpen: true,
      car,
      onUpdate: vi.fn(),
      onClose: vi.fn(),
      ...overrides,
    };

    render(<UpdateCarModal {...props} />);
    return props;
  };

  /**
   * TEST 1: Modal se ne renderuje kada je zatvoren
   * ZASTO: UpdateCarModal ima if (!isOpen) return null; - mora da
   * renderuje null kada je isOpen=false.
   * KAKO: queryByText vraca null ako element ne postoji, pa
   * not.toBeInTheDocument() proverava da element nije prisutan.
   */
  it('does not render when closed', async () => {
    renderModal({ isOpen: false });

    expect(screen.queryByText(l.cars.updateCar)).not.toBeInTheDocument();
  });

  /**
   * TEST 2: Renderovanje trenutnih vrednosti automobila
   * ZASTO: Treba verifikovati da su sva polja pre-popunjena sa
   * trenutnim vrednostima automobila iz car prop-a.
   * KAKO:
   * - getByLabelText za inpute i selecte (accessibility-first)
   * - toHaveValue() za proveru vrednosti
   * - getByPlaceholderText za description textarea
   */
  it('renders current car values', async () => {
    renderModal();

    expect(screen.getByLabelText(l.cars.model)).toHaveValue('X5');
    expect(screen.getByLabelText(l.cars.horsepower)).toHaveValue('250');

    expect(screen.getByLabelText(l.cars.carLocation)).toHaveValue(
      'New Belgrade'
    );

    expect(screen.getByLabelText(l.cars.pricePerDayLabel)).toHaveValue(90);

    expect(screen.getByPlaceholderText(l.common.clickToUpload)).toHaveValue(
      'Family SUV'
    );
  });

  /**
   * TEST 3: Azuriranje vrednosti pre slanja
   *
   * ZASTO JE OVDE ISPRAVKA:
   * Input za model vec ima vrednost "X5" (iz car prop-a). `user.type()`
   * NE brise postojeci tekst - samo dopisuje nova slova na kraj, kao
   * kad kucas na kraju vec upisane reci u Word-u. Zato je "X3" postajalo
   * "X5X3".
   *
   * Resenje: prvo pozovemo `user.clear(input)` da ispraznimo polje,
   * pa tek onda otkucamo "X3".
   */
  it('updates field values before submitting', async () => {
    const user = userEvent.setup();
    renderModal();

    const modelInput = screen.getByLabelText(l.cars.model);
    await user.clear(modelInput);
    await user.type(modelInput, 'X3');

    expect(modelInput).toHaveValue('X3');
  });

  /**
   * TEST 4: Cancel dugme poziva onClose callback
   * ZASTO: Kada korisnik odustane od azuriranja, modal treba da se
   * zatvori. UpdateCarModal poziva onClose() na Cancel klik.
   * KAKO: fireEvent.click na Cancel button, zatim provera da
   * props.onClose nije prazan.
   */
  it('calls onClose when Cancel is clicked', async () => {
    const user = userEvent.setup();
    const props = renderModal();

    await user.click(screen.getByRole('button', { name: l.common.cancel }));

    expect(props.onClose).toHaveBeenCalledOnce();
  });

  /**
   * TEST 5: Uspesno azuriranje i poziv callback-ova
   * ZASTO: Kljucni flow - korisnik izmeni podatke, klikne Save,
   * fetch uspe, pozivaju se onUpdate i onClose callback-ovi.
   * KAKO:
   * 1. Mockujemo fetch da vrati ok: true i JSON sa updatedCar
   * 2. Ocistimo Model polje i upisemo "X3" (isti fix kao u testu 3)
   * 3. Kliknemo na Save dugme
   * 4. Cekamo da fetch bude pozvan sa tacnim argumentima
   * 5. Proveravamo body request-a sadrzi _id i izmenjen model
   * 6. Proveravamo da su onUpdate(updatedCar) i onClose() pozvani
   *
   * Znacaj: Koristimo waitFor jer je fetch async. Proveravamo
   * requestOptions?.body da bismo videli sta je stvarno poslato.
   */
  it('submits changed car data and calls callbacks on success', async () => {
    const user = userEvent.setup();
    const updatedCar = {
      ...car,
      carModel: 'X3',
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ car: updatedCar }),
    } as Response);

    const props = renderModal();

    const modelInput = screen.getByLabelText(l.cars.model);
    await user.clear(modelInput);
    await user.type(modelInput, 'X3');

    await user.click(screen.getByRole('button', { name: l.common.save }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/cars/update-car',
        expect.objectContaining({
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });

    const requestOptions = vi.mocked(fetch).mock.calls[0][1];
    expect(JSON.parse(requestOptions?.body as string)).toMatchObject({
      _id: 'car-1',
      carModel: 'X3',
    });

    expect(props.onUpdate).toHaveBeenCalledWith(updatedCar);
    expect(props.onClose).toHaveBeenCalledOnce();
  });

  /**
   * TEST 6: Error alert kada fetch ne uspe
   * ZASTO: Kada fetch vrati ok: false, treba da prikazemo alert
   * sa greskom i ne smemo da pozovemo onUpdate ili onClose.
   * KAKO:
   * 1. Mockujemo fetch da vrati ok: false i JSON sa greskom
   * 2. Kliknemo na Save dugme (ne menjamo nista)
   * 3. Cekamo da alert bude pozvan sa tacnom greskom
   * 4. Proveravamo da onUpdate i onClose nisu pozvani
   */
  it('shows server error when update fails', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => ({
        message: 'Unable to update this car.',
      }),
    } as Response);

    const props = renderModal();

    await user.click(screen.getByRole('button', { name: l.common.save }));

    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith('Unable to update this car.');
    });

    expect(props.onUpdate).not.toHaveBeenCalled();
    expect(props.onClose).not.toHaveBeenCalled();
  });
});
