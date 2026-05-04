'use client';

type Props = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  required: boolean;
};

export const inputClasses =
  'w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700';
export const labelClasses =
  'block mb-2 text-sm font-semibold text-gray-600 ml-1';

const FormInput = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  required,
}: Props) => (
  <div>
    <label htmlFor={name} className={labelClasses}>
      {label}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={inputClasses}
    />
  </div>
);

export default FormInput;
