'use client';

import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ICar } from '@/lib/model/car/Car';
import { CarFilterState } from '@/lib/model/car/CarFilterState';
import { CarCity } from '@/lib/model/car/CarCity';
import { Calendar, MapPin, Search, Info } from 'lucide-react';
import MobileCarSearchResults from './MobileCarSearchResults';
import BookingDialog from '../BookNowDialog';
import MobileCarDetailsDrawer, { IOwner } from './MobileCarDetailsDrawer';
import { IUser } from '@/lib/model/User';

const labelClass =
  'block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5';

const inputClass =
  'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm ' +
  'focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ' +
  'outline-none transition-all appearance-none';

interface CarRentalSearchProps {
  filters: CarFilterState;
}

const MobileCarRentalSearch: React.FC<CarRentalSearchProps> = ({ filters }) => {
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [results, setResults] = useState({
    data: [] as ICar[],
    total: 0,
    loading: false,
  });

  const [activeCar, setActiveCar] = useState<{
    car: ICar | null;
    owner: IOwner | null;
  }>({ car: null, owner: null });

  const [modals, setModals] = useState({ booking: false, details: false });

  const daysSelected =
    startDate && endDate
      ? Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000)
      : 0;

  const fetchCars = async () => {
    setResults((prev) => ({ ...prev, loading: true }));

    try {
      const query = new URLSearchParams({ city });

      Object.entries(filters).forEach(([key, value]) => {
        if (value) query.set(key, value);
      });

      // Datume konvertujemo u ISO format koji API očekuje
      // Date objekat ima .toISOString() metodu direktno
      if (startDate) query.set('start', startDate.toISOString());
      if (endDate) query.set('end', endDate.toISOString());

      const res = await fetch(`/api/cars?${query}`);
      const data = await res.json();

      setResults({
        data: data.cars ?? [],
        total: data.totalCars ?? 0,
        loading: false,
      });
    } catch (error) {
      console.error('Error while fetching cars:', error);
      setResults((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchCars();
  }, [filters]);

  const handleViewDetails = async (car: ICar) => {
    setActiveCar({ car, owner: null });
    setModals((prev) => ({ ...prev, details: true }));

    try {
      const res = await fetch(`/api/users/${car.owner}`);
      const data = await res.json();

      if (res.ok) setActiveCar((prev) => ({ ...prev, owner: data }));
    } catch (error) {
      console.error('Error while fetching owner:', error);
    }
  };

  // ─── Potvrda rezervacije ─────────────────────────────────────────────────────
  const handleBookingConfirmation = async () => {
    if (!activeCar.car) return;

    try {
      const resposne = await fetch('/api/book-now', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId: activeCar.car._id,
          carLocation: activeCar.car.carLocation,
          startDate,
          endDate,
        }),
      });

      if (resposne.ok) {
        setResults((prevResult) => ({
          ...prevResult,
          data: prevResult.data.filter((car) => car._id !== activeCar.car?._id),
          total: prevResult.total - 1,
        }));

        setModals({ booking: false, details: false });
      } else {
        alert(
          'Reservation failed. Please make sure you are logged in and try again.'
        );
      }
    } catch {
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div>
          <label className={labelClass}>Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={`${inputClass} pl-10`}
            >
              <option value="">All cities (Serbia)</option>
              {Object.values(CarCity).map((car) => (
                <option key={car} value={car}>
                  {car}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Pick-up Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 z-10 pointer-events-none" />
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Start Date"
                minDate={new Date()}
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Return Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 z-10 pointer-events-none" />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="Return Date"
                minDate={startDate || new Date()}
              />
            </div>
          </div>
        </div>

        <button
          onClick={fetchCars}
          disabled={results.loading}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 disabled:opacity-50"
        >
          {results.loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          Search Cars
        </button>

        {daysSelected > 0 && (
          <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <p className="text-[11px] font-medium text-blue-700 leading-tight">
              Odabrano: <span className="font-bold">{daysSelected} dana</span>.
              Datumi će biti popunjeni pri rezervaciji.
            </p>
          </div>
        )}
      </div>

      {/* ── Lista rezultata ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              Dostupni automobili
            </h2>
            <p className="text-[11px] font-medium text-blue-700 leading-tight">
              Selected: <span className="font-bold">{daysSelected} days</span>.
              Dates will be filled in upon booking.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {results.data.map((car) => (
            <MobileCarSearchResults
              key={car._id}
              car={car}
              onBookNow={() => {
                setActiveCar({ car, owner: null });
                setModals((prev) => ({ ...prev, booking: true }));
              }}
              onViewDetails={() => handleViewDetails(car)}
            />
          ))}

          {!results.loading && results.data.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-400 italic">
                Not found any cars matching your criteria. Please adjust your
                filters and try again.
              </p>
            </div>
          )}
        </div>
      </div>

      {activeCar.car && (
        <>
          <MobileCarDetailsDrawer
            car={activeCar.car}
            owner={activeCar.owner}
            isOpen={modals.details}
            onClose={() => setModals((prev) => ({ ...prev, details: false }))}
            onBookNow={() => setModals({ details: false, booking: true })}
          />

          <BookingDialog
            car={activeCar.car}
            isOpen={modals.booking}
            startDate={startDate}
            endDate={endDate}
            onClose={() => setModals((prev) => ({ ...prev, booking: false }))}
            onBook={handleBookingConfirmation}
          />
        </>
      )}
    </div>
  );
};

export default MobileCarRentalSearch;
