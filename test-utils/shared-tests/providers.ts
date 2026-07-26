import { describe, expect, it, vi } from 'vitest';

export const runDescribeWithProviders = (name: string, fn: () => void) => {
  describe(name, () => {
    vi.clearAllMocks();
    fn();
  });
};
