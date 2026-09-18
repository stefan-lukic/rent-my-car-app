'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  LockKeyhole,
  Mail,
  Phone,
  Save,
  UserRound,
} from 'lucide-react';
import FormInput from '@/components/UI/FormInput';
import { useEditProfile } from '@/hooks/useEditProfile';
import l from '@/helper/en';

type EditProfileFormProps = {
  initialProfile: {
    name: string;
    email: string;
    contactInfo: string;
    profileImage: string;
  };
};

export default function EditProfileForm({
  initialProfile,
}: EditProfileFormProps) {
  const {
    profileData,
    imagePreview,
    isSubmitting,
    error,
    handleInputChange,
    handleSubmit,
  } = useEditProfile(initialProfile);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 md:py-8 lg:px-8">
      <Link
        href="/profile/my-profile"
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-body-subtle transition hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4" />
        {l.profile.backToProfile}
      </Link>

      <header className="overflow-hidden rounded-2xl bg-ink px-6 py-7 shadow-md sm:px-8 md:py-9">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-brand/20">
            <UserRound className="h-3.5 w-3.5" />
            {l.profile.accountSettingsTag}
          </span>
          <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-white md:text-4xl">
            {l.profile.editProfileHeroTitle}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-border-strong md:text-base">
            {l.profile.editProfileHeroDesc}
          </p>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mt-5 grid items-start gap-5 lg:grid-cols-[0.8fr_1.2fr]"
      >
        <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <div className="border-b border-surface-muted px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
              {l.profile.profilePhoto}
            </p>
            <h2 className="mt-1 font-heading text-xl font-bold text-ink">
              {l.profile.publicIdentity}
            </h2>
          </div>

          <div className="flex flex-col items-center px-6 py-8 text-center">
            <div className="relative h-36 w-36 overflow-hidden rounded-2xl border-4 border-white bg-surface-muted shadow-sm ring-1 ring-border">
              <Image
                src={imagePreview || '/placeholder-user.svg'}
                alt="Profile preview"
                fill
                sizes="144px"
                className="object-cover"
                priority
                unoptimized
              />
            </div>

            <input
              id="profile-image"
              type="file"
              name="image"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleInputChange}
              className="peer sr-only"
            />
            <label
              htmlFor="profile-image"
              className="mt-6 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand/90 peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2"
            >
              <Camera className="h-4 w-4" />
              {l.profile.chooseNewPhoto}
            </label>

            <p className="mt-3 text-xs leading-5 text-body-subtle">
              {l.profile.photoFileHint}
            </p>
            <div className="mt-6 flex w-full items-start gap-3 rounded-2xl bg-brand-tint p-4 text-left">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand" />
              <p className="text-xs leading-5 text-body-muted">
                {l.profile.photoTrustHint}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white shadow-sm">
          <div className="border-b border-surface-muted px-6 py-5 sm:px-7">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
              {l.profile.personalDetails}
            </p>
            <h2 className="mt-1 font-heading text-xl font-bold text-ink">
              {l.profile.howPeopleReachYou}
            </h2>
          </div>

          <div className="space-y-6 px-6 py-6 sm:px-7">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-4 top-[43px] z-10 h-4 w-4 text-body-faint" />
                <FormInput
                  label={l.profile.fullName}
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  placeholder={l.profile.fullNamePlaceholder}
                  required
                  maxLength={80}
                  className="pl-11"
                />
              </div>

              <div className="relative">
                <Phone className="pointer-events-none absolute left-4 top-[43px] z-10 h-4 w-4 text-body-faint" />
                <FormInput
                  label={l.common.phoneNumber}
                  name="contactInfo"
                  type="tel"
                  value={profileData.contactInfo}
                  onChange={handleInputChange}
                  placeholder={l.profile.phoneNumberPlaceholder}
                  required
                  maxLength={25}
                  className="pl-11"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-4">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-[43px] z-10 h-4 w-4 text-body-faint" />
                <FormInput
                  label={l.common.email}
                  name="email"
                  type="email"
                  value={initialProfile.email}
                  disabled
                  className="cursor-not-allowed bg-surface-muted pl-11 text-body-subtle"
                />
              </div>
              <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-body-subtle">
                <LockKeyhole className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                {l.profile.emailLockedHint}
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-surface-muted pt-6 sm:flex-row sm:justify-end">
              <Link
                href="/profile/my-profile"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-white px-6 py-3 text-sm font-semibold text-body transition-colors hover:bg-surface"
              >
                {l.common.cancel}
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:bg-brand/70"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? l.common.saving : l.common.save}
              </button>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
