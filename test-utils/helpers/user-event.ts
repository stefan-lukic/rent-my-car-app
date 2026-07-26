import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const renderWithUser = () => {
  const user = userEvent.setup();
  return { user };
};