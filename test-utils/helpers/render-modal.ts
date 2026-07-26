import React from 'react';
import { vi } from 'vitest';
import { render } from '@testing-library/react';

export const renderModal = (
  ui: React.ReactElement,
  overrides: Record<string, unknown> = {}
) => {
  const defaultProps: Record<string, unknown> = {
    isOpen: true,
    onClose: vi.fn(),
    ...overrides,
  };

  const rendered = render(ui);

  return {
    ...rendered,
    props: defaultProps,
  };
};