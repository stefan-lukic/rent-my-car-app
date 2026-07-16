import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import l from '@/helper/en';

export const inputClasses =
  'w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors';

export const labelClasses = 'mb-2 block text-sm font-semibold text-gray-700';

type CustomDatePickerProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
  maxDate?: Date;
  minDate?: Date;
  placeholderText?: string;
};

export default function CustomDatePicker<T extends FieldValues>({
  name,
  control,
  label,
  maxDate,
  minDate,
  placeholderText = l.cars.selectDate,
}: CustomDatePickerProps<T>) {
  const inputId = `${name}-input`;

  return (
    <div className="w-full">
      <label htmlFor={inputId} className={labelClasses}>
        {label}
      </label>

      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <DatePicker
              id={inputId}
              selected={field.value ?? null}
              onChange={field.onChange}
              dateFormat="MM/dd/yyyy"
              maxDate={maxDate}
              minDate={minDate}
              className={inputClasses}
              placeholderText={placeholderText}
            />

            {fieldState.error && (
              <p className="text-red-500 text-sm mt-1">
                {fieldState.error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
}
