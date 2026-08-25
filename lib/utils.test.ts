import { describe, expect, it } from 'vitest';
import { authFormSchema, cn, renterSchema } from './utils';

describe('cn', () => {
  it('zadrzava poslednju Tailwind klasu kada se klase sukobljavaju', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});

describe('authFormSchema', () => {
  it('prihvata ispravne podatke za registraciju', () => {
    const result = authFormSchema('sign-up').safeParse({
      name: 'Marko Markovic',
      email: 'marko@example.com',
      password: 'sigurna-lozinka',
      phoneNumber: '+381 60 123 4567',
    });

    expect(result.success).toBe(true);
  });

  it('odbija prekratko ime pri registraciji', () => {
    const result = authFormSchema('sign-up').safeParse({
      name: 'Mi',
      email: 'marko@example.com',
      password: 'sigurna-lozinka',
      phoneNumber: '+381 60 123 4567',
    });

    expect(result.success).toBe(false);
  });

  it('ne zahteva ime pri prijavljivanju', () => {
    const result = authFormSchema('sign-in').safeParse({
      email: 'marko@example.com',
      password: 'sigurna-lozinka',
      phoneNumber: '+381 60 123 4567',
    });

    expect(result.success).toBe(true);
  });

  it('zahteva broj telefona pri registraciji', () => {
    const result = authFormSchema('sign-up').safeParse({
      name: 'Marko Markovic',
      email: 'marko@example.com',
      password: 'sigurna-lozinka',
      phoneNumber: '',
    });

    expect(result.success).toBe(false);
  });

  it('odbija neispravan broj telefona pri registraciji', () => {
    const result = authFormSchema('sign-up').safeParse({
      name: 'Marko Markovic',
      email: 'marko@example.com',
      password: 'sigurna-lozinka',
      phoneNumber: 'telefon',
    });

    expect(result.success).toBe(false);
  });

  it('odbija email koji nema ispravan format', () => {
    const result = authFormSchema('sign-in').safeParse({
      email: 'ovo-nije-email',
      password: 'sigurna-lozinka',
    });

    expect(result.success).toBe(false);
  });

  it('odbija prekratku lozinku pri prijavljivanju', () => {
    const result = authFormSchema('sign-in').safeParse({
      email: 'marko@example.com',
      password: 'kratna',
    });

    expect(result.success).toBe(false);
  });

  it('odbija email sa neispravnim formatom pri registraciji', () => {
    const result = authFormSchema('sign-up').safeParse({
      name: 'Marko Markovic',
      email: 'neispravan-email',
      password: 'sigurna-lozinka',
      phoneNumber: '+381601234567',
    });

    expect(result.success).toBe(false);
  });
});

describe('renterSchema', () => {
  it('odbija renter formu kada nedostaje obavezno polje', () => {
    const result = renterSchema.safeParse({
      title: 'Izdavanje automobila',
      description: 'Opis usluge',
      address: 'Bulevar kralja Aleksandra 1',
      email: 'renter@example.com',
      phoneNumber: '',
      role: 'renter',
    });

    expect(result.success).toBe(false);
  });

  it('odbija renter formu kada email nema ispravan format', () => {
    const result = renterSchema.safeParse({
      title: 'Izdavanje automobila',
      description: 'Opis usluge',
      address: 'Bulevar kralja Aleksandra 1',
      email: 'neispravan-email',
      phoneNumber: '0612345678',
      role: 'renter',
    });

    expect(result.success).toBe(false);
  });
});
