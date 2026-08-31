import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';
import l from '@/helper/en';
import { isValidPhoneNumber } from './phoneNumber';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const authFormSchema = (type: string) =>
  z
    .object({
      name:
        type === 'sign-in'
          ? z.string().optional()
          : z.string().min(3, {
              message: l.validation.nameMinLength,
            }),
      email: z.string().email({ message: l.validation.invalidEmail }),
      password: z.string().min(8, {
        message:
          type === 'sign-in'
            ? l.validation.invalidPassword
            : l.validation.passwordMinLength,
      }),
      confirmPassword:
        type === 'sign-in'
          ? z.string().optional()
          : z.string().min(1, { message: l.auth.confirmPasswordRequired }),
      phoneNumber:
        type === 'sign-in'
          ? z.string().optional()
          : z
              .string()
              .trim()
              .min(1, { message: l.validation.phoneNumberRequired })
              .refine(isValidPhoneNumber, {
                message: l.validation.invalidPhoneNumber,
              }),
    })
    .superRefine((data, context) => {
      if (type === 'sign-up' && data.password !== data.confirmPassword) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['confirmPassword'],
          message: l.auth.passwordsDoNotMatch,
        });
      }
    });

export const renterSchema = z.object({
  title: z.string().nonempty(l.errors.titleRequired),
  description: z.string().nonempty(l.errors.descriptionRequired),
  address: z.string().nonempty(l.errors.addressRequired),
  email: z.string().email(l.validation.invalidEmail),
  phoneNumber: z.string().nonempty(l.errors.phoneNumberRequired),
  role: z.string().nonempty(l.errors.roleRequired),
});

export type RenterFormSchema = z.infer<typeof renterSchema>;
