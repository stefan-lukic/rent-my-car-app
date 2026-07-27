import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DeleteCarModal from './DeleteCarModal';
import l from '@/helper/en';

describe('DeleteCarModal', () => {
  /**
   * beforeEach: Restartujemo mockove i postavljamo globalne mockove.
   * Značaj: DeleteCarModal koristi direktno fetch i alert, zato ih
   * mockujemo na globalnom nivou. Ovo osigurava da svaki test počne
   * sa čistim stanjem.
   */
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', vi.fn());
    vi.stubGlobal('alert', vi.fn());
  });

  /**
   * renderModal: Helper funkcija za renderovanje modala sa zadatim props.
   * Značaj: Uspostavlja konzistentan setup za sve testove, pruža
   * pristup props-ima za proveru callback-ova.
   * @param overrides - Opcioni props koji override-uju defaultne vrednosti
   * @returns props objekat za proveru callback-ova u testovima
   */
  const renderModal = (overrides = {}) => {
    const props = {
      isOpen: true,
      carId: 'car-1',
      onDelete: vi.fn(),
      onClose: vi.fn(),
      ...overrides,
    };

    render(<DeleteCarModal {...props} />);
    return props;
  };

  /**
   * TEST 1: Modal se ne renderuje kada je zatvoren
   * ZAŠTO: DeleteCarModal ima if (!isOpen) return null; — mora da
   * renderuje null kada je isOpen=false.
   * KAKO: queryByText vraća null ako element ne postoji, pa
   * not.toBeInTheDocument() proverava da element nije prisutan.
   */
  it('does not render when closed', async () => {
    const user = userEvent.setup();
    renderModal({ isOpen: false });

    expect(screen.queryByText(l.cars.deleteCar)).not.toBeInTheDocument();
  });

  /**
   * TEST 2: Renderovanje sadržaja modala kada je otvoren
   * ZAŠTO: Treba verifikovati da se prikažu svi elementi: heading,
   * confirmation tekst, Cancel i Delete dugmad.
   * KAKO: getByText za tekstualne elemente, getByRole('button') za
   * dugmad. Koristimo l.cars.deleteCar i l.cars.deleteCarConfirm
   * za tekstove iz lokalizacije.
   */
  it('renders confirmation content when open', async () => {
    const user = userEvent.setup();
    renderModal();

    expect(screen.getByText(l.cars.deleteCar)).toBeInTheDocument();
    expect(screen.getByText(l.cars.deleteCarConfirm)).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: l.common.cancel })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: l.common.delete })
    ).toBeInTheDocument();
  });

  /**
   * TEST 3: Cancel dugme poziva onClose callback
   * ZAŠTO: Kada korisnik odustane od brisanja, modal treba da se
   * zatvori. DeleteCarModal poziva onClose() na Cancel klik.
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
   * TEST 4: Uspešno brisanje i zatvaranje modala
   * ZAŠTO: Ključni flow — korisnik klikne Delete, fetch uspe,
   * pozivaju se onDelete i onClose callback-ovi.
   * KAKO:
   * 1. Mockujemo fetch da vrati ok: true (uspešan DELETE zahtev)
   * 2. Kliknemo na Delete dugme
   * 3. Čekamo da fetch bude pozvan sa tačnim argumentima
   *    (method: DELETE, body sa carId)
   * 4. Proveravamo da su onDelete(carId) i onClose() pozvani
   *
   * Značaj: Koristimo waitFor jer fetch je async operacija.
   */
  it('deletes the selected car and closes after successful response', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
    } as Response);

    const props = renderModal();

    await user.click(screen.getByRole('button', { name: l.common.delete }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/cars/delete-car', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: 'car-1' }),
      });
    });

    expect(props.onDelete).toHaveBeenCalledWith('car-1');
    expect(props.onClose).toHaveBeenCalledOnce();
  });

  /**
   * TEST 5: Disabled Delete dugme dok se šalje request
   * ZAŠTO: Kada je fetch u toku, dugme treba da bude disabled da
   * korisnik ne može da klikne više puta. Tekst treba da bude "Deleting...".
   * KAKO:
   * 1. Mockujemo fetch da vrati Promise koji nikad ne resolve-uje
   *    (simuliramo pending request)
   * 2. Kliknemo na Delete dugme
   * 3. Proveravamo da je dugme sa tekstom "Deleting..." disabled
   */
  it('disables delete button while delete request is pending', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockReturnValue(new Promise(() => {}));

    renderModal();

    await user.click(screen.getByRole('button', { name: l.common.delete }));

    expect(
      screen.getByRole('button', { name: l.common.deleting })
    ).toBeDisabled();
  });

  /**
   * TEST 6: Error alert kada fetch ne uspe
   * ZAŠTO: Kada fetch vrati ok: false, treba da prikažemo alert
   * sa greškom i ne smemo da pozovemo onDelete ili onClose.
   * KAKO:
   * 1. Mockujemo fetch da vrati ok: false
   * 2. Kliknemo na Delete dugme
   * 3. Čekamo da alert bude pozvan sa tačnom greškom
   * 4. Proveravamo da onDelete i onClose nisu pozvani
   */
  it('shows error alert when delete request fails', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
    } as Response);

    const props = renderModal();

    await user.click(screen.getByRole('button', { name: l.common.delete }));

    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith(l.cars.deleteCarError);
    });

    expect(props.onDelete).not.toHaveBeenCalled();
    expect(props.onClose).not.toHaveBeenCalled();
  });
});
