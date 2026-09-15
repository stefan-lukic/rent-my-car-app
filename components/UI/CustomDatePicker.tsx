import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import l from '@/helper/en';

export const inputClasses =
  'min-h-11 w-full rounded-xl border border-border bg-surface-0 px-4 py-3 text-sm text-ink shadow-sm transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-tint';

export const labelClasses = 'mb-2 block text-sm font-semibold text-body';

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
              <p className="mt-1 text-sm text-danger">
                {fieldState.error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
}
