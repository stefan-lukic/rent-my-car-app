import React from 'react';
import { Control, FieldPath } from 'react-hook-form';
import { z } from 'zod';
import { FormField, FormLabel, FormControl, FormMessage } from './Form';
import { Input } from './Input';
import { authFormSchema } from '@/lib/utils';

const formSchema = authFormSchema('sign-up');

interface CustomInput {
  control: Control<z.infer<typeof formSchema>>;
  name: FieldPath<z.infer<typeof formSchema>>;
  label: string;
  placeholder?: string;
  type: string;
  maxLength?: number;
  endAdornment?: React.ReactNode;
}

const CustomInput = ({
  control,
  name,
  label,
  placeholder,
  type,
  maxLength,
  endAdornment,
}: CustomInput) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="form-item">
          <FormLabel className="form-label">{label}</FormLabel>
          <div className="flex w-full flex-col">
            <div className="relative w-full">
              <FormControl>
                {maxLength ? (
                  <Input
                    type={type}
                    placeholder={placeholder}
                    className="input-class min-w-16 max-w-24 placeholder:text-base placeholder:text-gray-500"
                    maxLength={maxLength}
                    {...field}
                  />
                ) : (
                  <Input
                    type={type}
                    placeholder={placeholder}
                    className={`input-class placeholder:text-gray-500 ${endAdornment ? 'pr-12' : ''}`}
                    {...field}
                  />
                )}
              </FormControl>
              {endAdornment && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {endAdornment}
                </div>
              )}
            </div>
            <FormMessage className="form-message mt-2" />
          </div>
        </div>
      )}
    />
  );
};
export default CustomInput;
