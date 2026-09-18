import l from '@/helper/en';
import type { ReactNode } from 'react';
import Skeleton from './Skeleton';

const LoadingRegion = ({ children }: { children: ReactNode }) => (
  <div role="status" aria-label={l.common.loading} aria-busy="true">
    {children}
    <span className="sr-only">{l.common.loading}</span>
  </div>
);

export function CarCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface-0 shadow-sm">
      <Skeleton className="h-56 w-full rounded-none" />
      <div className="space-y-4 p-5">
        <div className="flex justify-between gap-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-7 w-24" />
        </div>
        <div className="flex gap-3 border-t border-surface-muted pt-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1 bg-brand-tint" />
        </div>
      </div>
    </div>
  );
}

export function CarResultsSkeleton({ mobile = false }: { mobile?: boolean }) {
  return (
    <LoadingRegion>
      <div
        data-testid="car-results-skeleton"
        className={
          mobile
            ? 'flex flex-col gap-5'
            : 'grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'
        }
      >
        {Array.from({ length: mobile ? 2 : 6 }, (_, index) => (
          <CarCardSkeleton key={index} />
        ))}
      </div>
    </LoadingRegion>
  );
}

export function AuthFormSkeleton() {
  return (
    <LoadingRegion>
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-surface px-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface-0 p-6 shadow-lg">
          <div className="mb-10 flex flex-col items-center gap-3">
            <Skeleton className="h-8 w-52" />
            <Skeleton className="h-4 w-64 max-w-full" />
          </div>
          <div className="space-y-5">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full bg-brand-tint" />
            <Skeleton className="mx-auto h-4 w-40" />
          </div>
          <div className="mt-8 border-t border-surface-muted pt-6">
            <Skeleton className="mx-auto h-4 w-56 max-w-full" />
          </div>
        </div>
      </div>
    </LoadingRegion>
  );
}

export function AuthActionSkeleton() {
  return (
    <LoadingRegion>
      <div className="flex min-h-[400px] items-center justify-center bg-surface px-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface-0 p-8 shadow-lg">
          <div className="mb-8 flex flex-col items-center gap-3">
            <Skeleton className="h-8 w-52" />
            <Skeleton className="h-4 w-64 max-w-full" />
          </div>
          <Skeleton className="h-12 w-full bg-brand-tint" />
        </div>
      </div>
    </LoadingRegion>
  );
}

export function HomePageSkeleton() {
  return (
    <LoadingRegion>
      <div className="min-h-screen bg-surface">
        <div className="border-b border-surface-muted bg-white px-4 py-5 md:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <Skeleton className="h-9 w-36" />
            <div className="hidden gap-4 md:flex">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-28 bg-brand-tint" />
            </div>
          </div>
        </div>
        <div className="border-b border-surface-muted bg-white px-4 py-12 md:py-16">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-5">
            <Skeleton className="h-7 w-44 rounded-full bg-brand-tint" />
            <Skeleton className="h-10 w-full max-w-xl md:h-14" />
            <Skeleton className="h-5 w-full max-w-lg" />
          </div>
        </div>
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:grid-cols-[280px_1fr] md:px-6">
          <Skeleton className="hidden h-80 md:block" />
          <div className="space-y-8">
            <Skeleton className="h-44 w-full bg-white" />
          </div>
        </div>
      </div>
    </LoadingRegion>
  );
}

export function ProfilePageSkeleton() {
  return (
    <LoadingRegion>
      <div className="min-h-screen bg-surface">
        <div className="hidden border-b border-surface-muted bg-white px-6 py-5 md:block">
          <Skeleton className="mx-auto h-10 max-w-5xl" />
        </div>
        <div className="mx-auto max-w-5xl space-y-4 p-3 md:p-6">
          <div className="flex items-center gap-4 rounded-2xl bg-brand p-5 md:gap-6 md:p-6">
            <Skeleton className="h-20 w-20 shrink-0 rounded-full bg-brand/70" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-40 bg-brand/70" />
              <Skeleton className="h-4 w-52 bg-brand/70" />
              <Skeleton className="h-3 w-32 bg-brand/70" />
            </div>
            <Skeleton className="hidden h-10 w-28 bg-brand-tint md:block" />
          </div>
          <div className="grid grid-cols-3 divide-x divide-surface-muted rounded-2xl bg-white py-5 shadow-sm">
            {[0, 1, 2].map((item) => (
              <div key={item} className="flex flex-col items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-3 w-14" />
              </div>
            ))}
          </div>
          <Skeleton className="h-12 w-full bg-brand-tint md:hidden" />
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-5 flex gap-3">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <CarCardSkeleton key={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </LoadingRegion>
  );
}

export function OwnerProfileSkeleton() {
  return (
    <LoadingRegion>
      <div className="min-h-screen bg-surface">
        <div className="border-b border-surface-muted bg-white px-4 py-4">
          <Skeleton className="mx-auto h-10 max-w-7xl" />
        </div>
        <div className="bg-ink px-4 pb-20 pt-7">
          <div className="mx-auto max-w-5xl space-y-9">
            <Skeleton className="h-5 w-36 bg-body" />
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end">
              <Skeleton className="h-28 w-28 shrink-0 rounded-2xl bg-body md:h-32 md:w-32" />
              <div className="flex w-full flex-col items-center gap-3 sm:items-start">
                <Skeleton className="h-6 w-28 rounded-full bg-brand/25" />
                <Skeleton className="h-9 w-48 bg-body" />
                <Skeleton className="h-4 w-full max-w-md bg-body" />
              </div>
              <Skeleton className="h-16 w-32 bg-ink-secondary" />
            </div>
          </div>
        </div>
        <div className="mx-auto -mt-7 max-w-5xl px-4">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-lg">
            <Skeleton className="h-4 w-28 bg-brand-tint" />
            <Skeleton className="mt-3 h-7 w-52" />
            <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[0, 1, 2, 3].map((item) => (
                <Skeleton key={item} className="h-28 w-full" />
              ))}
            </div>
            <div className="my-8 border-t border-border" />
            <div className="grid gap-7 lg:grid-cols-[0.75fr_1.25fr]">
              <div className="space-y-3">
                <Skeleton className="h-6 w-44" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-20 w-full bg-brand-tint" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </LoadingRegion>
  );
}

export function DetailPageSkeleton() {
  return (
    <LoadingRegion>
      <div className="min-h-screen bg-surface">
        <div className="border-b border-surface-muted bg-white px-4 py-4">
          <Skeleton className="mx-auto h-10 max-w-7xl" />
        </div>
        <div className="bg-ink px-4 py-12">
          <div className="mx-auto max-w-7xl space-y-5">
            <Skeleton className="h-5 w-32 bg-body" />
            <Skeleton className="h-12 w-2/3 max-w-xl bg-body" />
            <Skeleton className="h-5 w-48 bg-body" />
          </div>
        </div>
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-8">
            <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl bg-white" />
            <Skeleton className="h-48 w-full rounded-2xl bg-white" />
          </div>
          <Skeleton className="h-[520px] w-full rounded-2xl bg-white" />
        </div>
      </div>
    </LoadingRegion>
  );
}

export function EditProfileSkeleton() {
  return (
    <LoadingRegion>
      <main className="min-h-screen bg-surface px-4 py-5 sm:px-6 md:py-8">
        <div className="mx-auto max-w-6xl">
          <Skeleton className="mb-5 h-5 w-40" />
          <div className="rounded-2xl bg-ink-secondary px-6 py-8">
            <Skeleton className="h-6 w-36 bg-body" />
            <Skeleton className="mt-5 h-10 w-3/5 bg-body" />
            <Skeleton className="mt-4 h-5 w-2/3 bg-body" />
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-2xl border border-border bg-white p-6">
              <Skeleton className="h-6 w-36" />
              <div className="mt-10 flex justify-center">
                <Skeleton className="h-36 w-36 rounded-2xl" />
              </div>
              <Skeleton className="mx-auto mt-6 h-11 w-44 bg-brand-tint" />
              <Skeleton className="mt-8 h-20 w-full" />
            </div>
            <div className="space-y-6 rounded-2xl border border-border bg-white p-6">
              <Skeleton className="h-6 w-48" />
              <div className="grid gap-5 sm:grid-cols-2">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
              <Skeleton className="h-28 w-full" />
              <div className="flex justify-end gap-3 pt-6">
                <Skeleton className="h-11 w-28" />
                <Skeleton className="h-11 w-36 bg-brand-tint" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </LoadingRegion>
  );
}
