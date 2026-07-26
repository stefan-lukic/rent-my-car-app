import React from 'react';
import { vi } from 'vitest';

export const createNextLinkMock = () => {
  vi.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }: { children: React.ReactNode; href: string }) =>
      React.createElement('a', { href }, children),
  }));
};