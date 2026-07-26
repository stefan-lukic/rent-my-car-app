import { IRenter } from '@/lib/model/User';

export interface MockRenterOverrides extends Partial<IRenter> {
  _id?: string;
}

export const createMockRenter = (overrides?: MockRenterOverrides): IRenter => ({
  _id: 'renter-1',
  name: 'Marko Markovic',
  email: 'marko@example.com',
  contactInfo: '123-456',
  rating: 4.8,
  images: ['/avatar.jpg'],
  profilePicture: '/avatar.jpg',
  ...overrides,
}) as IRenter;