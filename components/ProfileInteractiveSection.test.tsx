import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProfileInteractiveSection from './ProfileInteractiveSection';
import l from '@/helper/en';
import type { ICar } from '@/lib/model/car/Car';
import { CarMake } from '@/lib/model/car/CarMake';
import { createNextNavigationMock } from '@/test-utils/mocks/next-navigation';
import { createMockCar } from '@/test-utils/fixtures/car';
import { createMockRental } from '@/test-utils/fixtures/rental';
createNextNavigationMock();

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('./CarCard', () => ({
  __esModule: true,
  default: ({ car, onUpdate, onDeleteClick }: any) => (
    <div data-testid="car-card" data-car-id={car._id}>
      <button onClick={() => onUpdate(car)}>Update</button>
      <button onClick={() => onDeleteClick(car)}>Delete</button>
    </div>
  ),
}));

vi.mock('./RentalCard', () => ({
  __esModule: true,
  default: ({ rental }: any) => (
    <div data-testid="rental-card" data-rental-id={rental._id}>
      Rental Card
    </div>
  ),
}));

vi.mock('./UpdateCarModal', () => ({
  __esModule: true,
  default: ({ isOpen, onClose, onUpdate }: any) =>
    isOpen ? (
      <div data-testid="update-modal">
        <button onClick={() => onUpdate({ _id: '1', make: 'BMW' })}>
          Save
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

vi.mock('./DeleteCarModal', () => ({
  __esModule: true,
  default: ({ isOpen, onClose, onDelete }: any) =>
    isOpen ? (
      <div data-testid="delete-modal">
        <button onClick={() => onDelete('1')}>Confirm</button>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

const mockCar = createMockCar({
  _id: 'car-1',
  make: CarMake.BMW,
  carModel: 'X5',
  pricePerDay: 80,
});
const mockRental = createMockRental({ car: mockCar });

describe('ProfileInteractiveSection', () => {
  const defaultProps = {
    cars: [mockCar],
    rentals: [mockRental],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * TEST 1: Renderuje oba tab-a (My Cars i My Rentals)
   * ZA�TO: Tabovi su osnovni nacin za navigaciju izmedu automobila
   *   i iznajmljivanja.
   * KAKO: getByText l.profile.myCars i l.profile.myRentals.
   */
  it('renders cars and rentals tabs', async () => {
    const user = userEvent.setup();
    render(<ProfileInteractiveSection {...defaultProps} />);

    expect(screen.getByText(l.profile.myCarsCount(1))).toBeInTheDocument();
    expect(screen.getByText(l.profile.myRentalsCount(1))).toBeInTheDocument();
  });

  /**
   * TEST 2: Prikazuje 'cars' tab kao aktivnog po defaultu
   * ZA�TO: Po defaultu, korisnik treba da vidi listu svojih automobila.
   * KAKO: Proveravamo da je 'Cars' tab ima active stil (bg-white, shadow)
   *   ili da su CarCard komponente renderovane.
   */
  it('shows cars tab as active by default', async () => {
    const user = userEvent.setup();
    render(<ProfileInteractiveSection {...defaultProps} />);

    const carCards = screen.getAllByTestId('car-card');

    expect(carCards.length).toBe(1);
  });

  /**
   * TEST 3: Switching na rentals tab
   * ZA�TO: Klik na My Rentals treba da prika�e RentalCard komponente.
   * KAKO: fireEvent.click na rentals tab, zatim proveravamo da
   *   su RentalCard elementi prisutni.
   */
  it('switches to rentals tab when My Rentals is clicked', async () => {
    const user = userEvent.setup();
    render(<ProfileInteractiveSection {...defaultProps} />);

    await user.click(screen.getByText(l.profile.myRentalsCount(1)));

    const rentalCards = screen.getAllByTestId('rental-card');

    expect(rentalCards.length).toBe(1);
  });

  /**
   * TEST 4: Prikazuje praznu poruku kada nema automobila
   * ZA�TO: Ako korisnik nema automobila, treba prikazati
   *   friendly poruku umesto praznog prostora.
   * KAKO: Prosledujemo prazan cars niz, proveravamo
   *   l.profile.noCarsListed tekst.
   */
  it('shows empty message when no cars are listed', async () => {
    const user = userEvent.setup();
    render(<ProfileInteractiveSection cars={[]} rentals={[]} />);

    expect(screen.getByText(l.profile.noCarsListed)).toBeInTheDocument();
  });

  /**
   * TEST 5: Prikazuje praznu poruku kada nema iznajmljivanja
   * ZA�TO: Isto kao za automobile � prazan rentals niz treba
   *   da prika�e odgovarajucu poruku.
   * KAKO: Prosledujemo prazan rentals niz, prikazujemo
   *   rentals tab, proveravamo poruku.
   */
  it('shows empty message when no rentals exist', async () => {
    const user = userEvent.setup();
    render(<ProfileInteractiveSection cars={[]} rentals={[]} />);

    expect(screen.getByText(l.profile.myRentalsCount(0))).toBeInTheDocument();

    await user.click(screen.getByText(l.profile.myRentalsCount(0)));

    expect(screen.getByText(l.profile.noRentalsYet)).toBeInTheDocument();
  });

  /**
   * TEST 6: Paginacija za automobile (3 po strani)
   * ZA�TO: Ako ih ima vi�e od 3, treba da se prika�e paginacija.
   * KAKO:
   * 1. Prosledujemo 5 automobila
   * 2. Proveravamo da je prva stranica prikazana
   * 3. Kliknemo na drugu stranicu
   * 4. Proveravamo da su automobili 4, 5 prikazani.
   */
  it('paginates cars correctly (3 per page)', async () => {
    const user = userEvent.setup();
    const manyCars: ICar[] = Array.from({ length: 5 }, (_, i) =>
      createMockCar({ _id: `car-${i}` })
    );

    render(<ProfileInteractiveSection cars={manyCars} rentals={[]} />);

    const carCards = screen.getAllByTestId('car-card');

    expect(carCards.length).toBe(3);

    const pageButtons = screen
      .getAllByRole('button')
      .filter((btn) => !isNaN(Number(btn.textContent)));

    await user.click(pageButtons[1]);

    const updatedCards = screen.getAllByTestId('car-card');

    expect(updatedCards.length).toBe(2);
  });

  /**
   * TEST 7: Otvara UpdateCarModal kada se klikne Update na CarCard
   * ZA�TO: Korisnik treba da mo�e da a�urira podatke o automobilu.
   * KAKO:
   * 1. Kliknemo na Update button na CarCard-u
   * 2. Proveravamo da je UpdateCarModal prisutan (data-testid).
   */
  it('opens UpdateCarModal when Update is clicked on a car card', async () => {
    const user = userEvent.setup();
    render(<ProfileInteractiveSection {...defaultProps} />);

    const updateButtons = screen.getAllByRole('button', { name: 'Update' });

    await user.click(updateButtons[0]);

    expect(screen.getByTestId('update-modal')).toBeInTheDocument();
  });

  /**
   * TEST 8: Otvara DeleteCarModal kada se klikne Delete na CarCard
   * ZA�TO: Potvrda brisanja je bitna za UX � treba modal za
   *   potvrdu pre nego �to se obri�e.
   * KAKO:
   * 1. Kliknemo na Delete button na CarCard-u
   * 2. Proveravamo da je DeleteCarModal prisutan.
   */
  it('opens DeleteCarModal when Delete is clicked on a car card', async () => {
    const user = userEvent.setup();
    render(<ProfileInteractiveSection {...defaultProps} />);

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });

    await user.click(deleteButtons[0]);

    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
  });

  /**
   * TEST 9: Zatvara modali nakon uspe�nog a�uriranja/brisanja
   * ZA�TO: Nakon potvrde, modal treba da se zatvori i lista
   *   treba da bude a�urirana.
   * KAKO:
   * 1. Otvaramo modal
   * 2. Kliknemo na Save/Confirm u modalu
   * 3. Proveravamo da modal nije prisutan (zatvoren).
   */
  it('closes UpdateCarModal after saving', async () => {
    const user = userEvent.setup();
    render(<ProfileInteractiveSection {...defaultProps} />);

    await user.click(screen.getAllByRole('button', { name: 'Update' })[0]);

    expect(screen.getByTestId('update-modal')).toBeInTheDocument();

    await user.click(screen.getByText('Save'));

    expect(screen.queryByTestId('update-modal')).not.toBeInTheDocument();
  });

  /**
   * TEST 10: Navigacija na /cars/add-car dugme
   * ZA�TO: Dugme za dodavanje novog automobila treba da koristi
   *   router.push() za navigaciju.
   * KAKO: fireEvent.click na "Add New Car" dugme, proveravamo
   *   da je mockPush pozvan sa '/cars/add-car'.
   */
  it('navigates to add car page when Add New Car is clicked', async () => {
    const user = userEvent.setup();
    render(<ProfileInteractiveSection {...defaultProps} />);

    await user.click(screen.getByText(l.cars.addNewCarBtn));

    expect(mockPush).toHaveBeenCalledWith('/cars/add-car');
  });

  /**
   * TEST 11: Prikazuje paginaciju kada postoji vi�e od 1 stranice
   * ZA�TO: Page number buttons trebaju biti vidljivi samo
   *   kada postoji vi�e od jedne stranice.
   * KAKO: Prosledujemo 5 automobila, proveravamo da postoji
   *   dugme sa brojem 2 (druga stranica).
   */
  it('shows pagination buttons when there are multiple pages', async () => {
    const user = userEvent.setup();
    const manyCars: ICar[] = Array.from({ length: 5 }, (_, i) =>
      createMockCar({ _id: `car-${i}` })
    );

    render(<ProfileInteractiveSection cars={manyCars} rentals={[]} />);

    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
  });
});
