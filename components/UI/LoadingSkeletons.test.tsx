import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import l from '@/helper/en';
import {
  AuthActionSkeleton,
  AuthFormSkeleton,
  CarResultsSkeleton,
  ProfilePageSkeleton,
} from './LoadingSkeletons';

describe('LoadingSkeletons', () => {
  it.each([
    ['auth', () => <AuthFormSkeleton />],
    ['auth action', () => <AuthActionSkeleton />],
    ['car results', () => <CarResultsSkeleton />],
    ['profile', () => <ProfilePageSkeleton />],
  ])('exposes an accessible loading state for %s', (_, renderSkeleton) => {
    render(renderSkeleton());

    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toHaveAccessibleName(l.common.loading);
  });

  it('renders fewer placeholder cards on mobile', () => {
    const { container } = render(<CarResultsSkeleton mobile />);

    expect(container.querySelectorAll('.overflow-hidden')).toHaveLength(2);
  });
});
