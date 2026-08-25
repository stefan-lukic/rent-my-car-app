export interface MockSessionOverrides {
  data?: { user?: { name?: string; email?: string } } | null;
  status?: 'loading' | 'authenticated' | 'unauthenticated';
}

export const createMockSession = (overrides?: MockSessionOverrides) => ({
  data: null,
  status: 'unauthenticated' as const,
  ...overrides,
});
