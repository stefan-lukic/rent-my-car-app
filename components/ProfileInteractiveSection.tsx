'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CalendarDays,
  CarFront,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
} from 'lucide-react';
import { ICar } from '@/lib/model/car/Car';
import { RentalWithCar } from '@/types/RentalWithCar';
import CarCard from './CarCard';
import RentalCard from './RentalCard';
import UpdateCarModal from './UpdateCarModal';
import DeleteCarModal from './DeleteCarModal';
import CancelRentalModal from './CancelRentalModal';
import l from '@/helper/en';
import RentalStatusFilter from './RentalStatusFilter';
import {
  getRentalLifecycleStatus,
  RentalLifecycleStatus,
  RentalStatusFilterValue,
} from '@/lib/rentalLifecycle';

interface ProfileInteractiveSectionProps {
  cars: ICar[];
  rentals: RentalWithCar[];
  currentDate: string;
}

interface PaginationButtonProps {
  direction: 'previous' | 'next';
  disabled: boolean;
  onClick: () => void;
  label: string;
}

const PaginationButton = ({
  direction,
  disabled,
  onClick,
  label,
}: PaginationButtonProps) => {
  const Icon = direction === 'previous' ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-border bg-white text-body transition-colors hover:border-brand/40 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-30"
    >
      <Icon className="h-5 w-5" />
    </button>
  );
};

const PageNumbers = ({
  count,
  current,
  onChange,
}: {
  count: number;
  current: number;
  onChange: (page: number) => void;
}) =>
  count > 1 ? (
    <div className="mt-5 flex justify-center gap-2">
      {Array.from({ length: count }, (_, index) => (
        <button
          type="button"
          key={index}
          onClick={() => onChange(index)}
          className={`h-9 w-9 rounded-lg text-sm font-semibold transition-colors ${
            current === index
              ? 'bg-brand text-white'
              : 'border border-border text-body-subtle hover:border-brand/40 hover:text-brand'
          }`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  ) : null;

const ProfileInteractiveSection = ({
  cars: initialCars,
  rentals: initialRentals,
  currentDate,
}: ProfileInteractiveSectionProps) => {
  const [activeTab, setActiveTab] = useState<'cars' | 'rentals'>('cars');
  const [cars, setCars] = useState<ICar[]>(initialCars);
  const [rentals, setRentals] = useState<RentalWithCar[]>(initialRentals);
  const [selectedCar, setSelectedCar] = useState<ICar | null>(null);
  const [carToDeleteId, setCarToDeleteId] = useState<string | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [rentalToCancelId, setRentalToCancelId] = useState<string | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentRentalPage, setCurrentRentalPage] = useState(0);
  const [rentalStatusFilter, setRentalStatusFilter] =
    useState<RentalStatusFilterValue>('all');
  const router = useRouter();

  const carsPerPage = 3;
  const rentalsPerPage = 3;
  const availableRentals = rentals.filter((rental) => rental.car !== null);
  const rentalCounts = availableRentals.reduce(
    (counts, rental) => {
      const status = getRentalLifecycleStatus(rental, currentDate);
      counts.all += 1;
      counts[status] += 1;
      return counts;
    },
    {
      all: 0,
      [RentalLifecycleStatus.Upcoming]: 0,
      [RentalLifecycleStatus.Ongoing]: 0,
      [RentalLifecycleStatus.Completed]: 0,
      [RentalLifecycleStatus.Cancelled]: 0,
    }
  );
  const filteredRentals = availableRentals.filter(
    (rental) =>
      rentalStatusFilter === 'all' ||
      getRentalLifecycleStatus(rental, currentDate) === rentalStatusFilter
  );
  const pageCount = Math.ceil(cars.length / carsPerPage);
  const rentalPageCount = Math.ceil(filteredRentals.length / rentalsPerPage);
  const currentCars = cars.slice(
    currentPage * carsPerPage,
    currentPage * carsPerPage + carsPerPage
  );
  const currentRentals = filteredRentals.slice(
    currentRentalPage * rentalsPerPage,
    currentRentalPage * rentalsPerPage + rentalsPerPage
  );

  const handleUpdateCar = (updatedCar: ICar) => {
    setCars((currentCars) =>
      currentCars.map((car) => (car._id === updatedCar._id ? updatedCar : car))
    );
    setIsUpdateModalOpen(false);
  };

  const handleDeleteCar = (carId: string) => {
    setCars((currentCars) => currentCars.filter((car) => car._id !== carId));
  };

  const handleCancelRental = (updatedRental: RentalWithCar) => {
    setRentals((currentRentals) =>
      currentRentals.map((rental) =>
        rental._id === updatedRental._id ? updatedRental : rental
      )
    );
    setCurrentRentalPage(0);
  };

  const handleRentalReviewed = (
    rentalId: string,
    review: NonNullable<RentalWithCar['clientReview']>
  ) => {
    setRentals((currentRentals) =>
      currentRentals.map((rental) =>
        rental._id === rentalId ? { ...rental, clientReview: review } : rental
      )
    );
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-6 py-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand">
            Your garage
          </p>
          <h2 className="mt-1 font-heading text-xl font-bold text-ink">
            Manage your activity
          </h2>
        </div>

        <div
          role="tablist"
          aria-label="Profile activity"
          className="flex gap-1 rounded-xl bg-surface-muted p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'cars'}
            onClick={() => setActiveTab('cars')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeTab === 'cars'
                ? 'bg-white text-ink shadow-sm'
                : 'text-body-subtle hover:text-ink-secondary'
            }`}
          >
            <CarFront className="h-4 w-4" />
            {l.profile.myCarsCount(cars.length)}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'rentals'}
            onClick={() => setActiveTab('rentals')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeTab === 'rentals'
                ? 'bg-white text-ink shadow-sm'
                : 'text-body-subtle hover:text-ink-secondary'
            }`}
          >
            <CalendarDays className="h-4 w-4" />
            {l.profile.myRentalsCount(availableRentals.length)}
          </button>
        </div>
      </div>

      {activeTab === 'cars' ? (
        <div className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="font-heading text-lg font-semibold text-ink">
                {l.profile.myCarsHeading}
              </h3>
              <p className="mt-1 text-sm text-body-subtle">
                Update your listings, availability and vehicle details.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/cars/add-car')}
              className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand/90"
            >
              <Plus className="h-4 w-4" />
              {l.cars.addNewCarBtn}
            </button>
          </div>

          {cars.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-border-strong bg-surface px-6 py-12 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-tint text-brand">
                <CarFront className="h-6 w-6" />
              </span>
              <p className="mt-4 font-semibold text-ink-secondary">
                {l.profile.noCarsListed}
              </p>
              <p className="mt-1 max-w-sm text-sm text-body-subtle">
                Create your first listing and make your car available to local
                renters.
              </p>
              <button
                type="button"
                onClick={() => router.push('/cars/add-car')}
                className="mt-5 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90"
              >
                {l.cars.addNewCarBtn}
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <PaginationButton
                  direction="previous"
                  label="Previous cars page"
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage((page) => page - 1)}
                />
                <div className="grid flex-1 grid-cols-3 gap-4">
                  {currentCars.map((car) => (
                    <CarCard
                      key={car._id}
                      car={car}
                      onUpdate={() => {
                        setSelectedCar(car);
                        setIsUpdateModalOpen(true);
                      }}
                      onDeleteClick={(selectedCar) => {
                        setCarToDeleteId(selectedCar._id);
                        setIsDeleteModalOpen(true);
                      }}
                    />
                  ))}
                </div>
                <PaginationButton
                  direction="next"
                  label="Next cars page"
                  disabled={currentPage >= pageCount - 1}
                  onClick={() => setCurrentPage((page) => page + 1)}
                />
              </div>
              <PageNumbers
                count={pageCount}
                current={currentPage}
                onChange={setCurrentPage}
              />
            </>
          )}
        </div>
      ) : (
        <div className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-ink-secondary">
                {l.profile.myRentalsHeading}
              </h3>
              <p className="mt-1 text-sm text-body-subtle">
                Review your reservations, dates and current rental status.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/#car-search')}
              className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand/90"
            >
              <Search className="h-4 w-4" />
              Browse Cars
            </button>
          </div>

          {availableRentals.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-border-strong bg-surface px-6 py-12 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-tint text-brand">
                <Search className="h-6 w-6" />
              </span>
              <p className="mt-4 font-semibold text-ink-secondary">
                {l.profile.noRentalsYet}
              </p>
              <p className="mt-1 text-sm text-body-subtle">
                Browse available cars and reserve one for your next trip.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-5">
                <RentalStatusFilter
                  value={rentalStatusFilter}
                  counts={rentalCounts}
                  label="Filter my rentals by status"
                  onChange={(status) => {
                    setRentalStatusFilter(status);
                    setCurrentRentalPage(0);
                  }}
                />
              </div>
              {filteredRentals.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border-strong bg-surface px-6 py-10 text-center text-sm text-body-subtle">
                  No reservations match this status.
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <PaginationButton
                      direction="previous"
                      label="Previous rentals page"
                      disabled={currentRentalPage === 0}
                      onClick={() => setCurrentRentalPage((page) => page - 1)}
                    />
                    <div className="grid flex-1 grid-cols-3 gap-4">
                      {currentRentals.map((rental) => (
                        <RentalCard
                          key={rental._id}
                          rental={rental}
                          currentDate={currentDate}
                          onReviewed={handleRentalReviewed}
                          onCancel={(rentalId) => {
                            setRentalToCancelId(rentalId);
                            setIsCancelModalOpen(true);
                          }}
                        />
                      ))}
                    </div>
                    <PaginationButton
                      direction="next"
                      label="Next rentals page"
                      disabled={currentRentalPage >= rentalPageCount - 1}
                      onClick={() => setCurrentRentalPage((page) => page + 1)}
                    />
                  </div>
                  <PageNumbers
                    count={rentalPageCount}
                    current={currentRentalPage}
                    onChange={setCurrentRentalPage}
                  />
                </>
              )}
            </>
          )}
        </div>
      )}

      {selectedCar && (
        <UpdateCarModal
          isOpen={isUpdateModalOpen}
          car={selectedCar}
          onUpdate={handleUpdateCar}
          onClose={() => setIsUpdateModalOpen(false)}
        />
      )}
      {carToDeleteId && (
        <DeleteCarModal
          isOpen={isDeleteModalOpen}
          carId={carToDeleteId}
          onDelete={handleDeleteCar}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setCarToDeleteId(null);
          }}
        />
      )}
      {rentalToCancelId && (
        <CancelRentalModal
          isOpen={isCancelModalOpen}
          rentalId={rentalToCancelId}
          onCancelled={handleCancelRental}
          onClose={() => {
            setIsCancelModalOpen(false);
            setRentalToCancelId(null);
          }}
        />
      )}
    </section>
  );
};

export default ProfileInteractiveSection;
