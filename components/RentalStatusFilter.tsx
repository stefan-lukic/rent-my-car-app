'use client';

import {
  RentalLifecycleStatus,
  RentalStatusFilterValue,
} from '@/lib/rentalLifecycle';
import l from '@/helper/en';

interface RentalStatusFilterProps {
  value: RentalStatusFilterValue;
  counts: Record<RentalStatusFilterValue, number>;
  onChange: (status: RentalStatusFilterValue) => void;
  label: string;
}

const options: { value: RentalStatusFilterValue; label: string }[] = [
  { value: 'all', label: l.status.all },
  { value: RentalLifecycleStatus.Upcoming, label: l.status.upcoming },
  { value: RentalLifecycleStatus.Ongoing, label: l.status.ongoing },
  { value: RentalLifecycleStatus.Completed, label: l.status.completed },
  { value: RentalLifecycleStatus.Cancelled, label: l.status.cancelled },
];

export default function RentalStatusFilter({
  value,
  counts,
  onChange,
  label,
}: RentalStatusFilterProps) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="flex gap-2 overflow-x-auto pb-1"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          onClick={() => onChange(option.value)}
          className={`flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            value === option.value
              ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
              : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700'
          }`}
        >
          {option.label}
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] ${
              value === option.value ? 'bg-white/20' : 'bg-slate-100'
            }`}
          >
            {counts[option.value]}
          </span>
        </button>
      ))}
    </div>
  );
}
