import React from 'react';
import { render } from '@testing-library/react';
import { vi } from 'vitest';

export const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui);
};