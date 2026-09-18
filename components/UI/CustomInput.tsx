import React from 'react';
import { Control, FieldPath } from 'react-hook-form';
import { z } from 'zod';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from './Form';
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
  visuallyHiddenLabel?: boolean;
}

const CustomInput = ({
  control,
  name,
  label,
  placeholder,
  type,
  maxLength,
  endAdornment,
  visuallyHiddenLabel = false,
}: CustomInput) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        // FormItem gives every label and input pair its own accessible ID.
        <FormItem className="form-item">
          <FormLabel
            className={`form-label ${visuallyHiddenLabel ? 'sr-only' : ''}`}
          >
            {label}
          </FormLabel>
          <div className="flex w-full flex-col">
            <div className="relative w-full">
              <FormControl>
                {maxLength ? (
                  <Input
                    type={type}
                    placeholder={placeholder}
                    className="min-w-16 max-w-24 placeholder:text-base placeholder:text-body-faint"
                    maxLength={maxLength}
                    {...field}
                  />
                ) : (
                  <Input
                    type={type}
                    placeholder={placeholder}
                    className={`placeholder:text-body-faint ${endAdornment ? 'pr-12' : ''}`}
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
        </FormItem>
      )}
    />
  );
};
export default CustomInput;
