import React from 'react';
import { vi } from 'vitest';

export const createNextImageMock = () => {
  vi.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
      const { src, alt, width, height, ...rest } = props || {};
      return React.createElement('img', { src, alt, width, height, ...rest });
    },
  }));
};