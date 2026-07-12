import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const authFormSchema = (type: string) =>
  z.object({
    name:
      type === 'sign-in'
        ? z.string().optional()
        : z.string().min(3, {
            message: 'First Name should be at least 3 characters long',
          }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, {
      message:
        type === 'sign-in'
          ? 'Invalid password'
          : 'Password should be at least 8 characters long',
    }),
  });

// not used, needs refactor for renter
export const renterSchema = z.object({
  title: z.string().nonempty('Title is required'),
  description: z.string().nonempty('Description is required'),
  address: z.string().nonempty('Address is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().nonempty('Phone Number is required'),
  role: z.string().nonempty('Role is required'),
});

export type RenterFormSchema = z.infer<typeof renterSchema>;
