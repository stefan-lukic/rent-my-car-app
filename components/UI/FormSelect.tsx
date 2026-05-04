'use client';

type Props = {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: string[];
  required?: boolean;
};

const inputClasses =
  'w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700';

const labelClasses = 'block mb-2 text-sm font-semibold text-gray-600 ml-1';

export default function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  required,
}: Props) {
  return (
    <div>
      <label className={labelClasses}>{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={inputClasses}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
