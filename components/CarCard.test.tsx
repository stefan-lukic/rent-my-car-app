import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CarCard from './CarCard';
import type { ICar } from '@/lib/model/car/Car';
import { createNextImageMock } from '@/test-utils/mocks/next-image';
import { createMockCar } from '@/test-utils/fixtures/car';
import { runCarCardSharedTests } from '@/test-utils/shared-tests/car-card';

createNextImageMock();

const mockCar = createMockCar();

describe('CarCard', () => {
  runCarCardSharedTests<ICar>({
    Component: CarCard,
    mockCar,
    editButtonMatcher: 'Edit',
    deleteButtonMatcher: 'Delete',
    onDeleteClickExpectedArg: mockCar,
  });
});
