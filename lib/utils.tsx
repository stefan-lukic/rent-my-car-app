import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const authFormSchema = (type: string) =>
  z.object({
    // sign up
    name:
      type === 'sign-in'
        ? z.string().optional()
        : z.string().min(3, {
            message: 'First Name should be at least 3 characters long',
          }),
    // both
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password should be at least 8 characters long' }),
  });

export const providerSchema = z.object({
  title: z.string().nonempty('Title is required'),
  description: z.string().nonempty('Description is required'),
  facilityName: z.string().nonempty('Facility Name is required'),
  address: z.string().nonempty('Address is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().nonempty('Phone Number is required'),
  role: z.string().nonempty('Role is required'),
});

export type ProviderFormSchema = z.infer<typeof providerSchema>;
