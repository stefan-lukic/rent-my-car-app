import { vi } from 'vitest';

export const createReactDatePickerMock = () => {
  vi.mock('react-datepicker', () => ({
    __esModule: true,
    default: ({
      selected,
      onChange,
      placeholderText,
      id,
    }: {
      selected: Date | null;
      onChange: (date: Date | null) => void;
      placeholderText: string;
      id?: string;
    }) => (
      <input
        id={id}
        data-testid={id || 'datepicker'}
        aria-label={id || 'DatePicker'}
        value={selected ? selected.toISOString() : ''}
        placeholder={placeholderText}
        onChange={() => onChange(new Date('2024-01-01'))}
      />
    ),
  }));
};