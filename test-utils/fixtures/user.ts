export interface MockUserOverrides {
  _id?: string;
  name?: string;
  email?: string;
  contactInfo?: string;
  images?: string[];
  rating?: number;
  createdAt?: string;
}

export const createMockUser = (overrides?: MockUserOverrides) => ({
  _id: 'user-1',
  name: 'Marko Markovic',
  email: 'marko@example.com',
  contactInfo: '+381 60 123 4567',
  images: ['/avatar.jpg'],
  rating: 4.8,
  createdAt: '2024-01-15T00:00:00.000Z',
  ...overrides,
});