'use client';

import { useState } from 'react';
import { Star, X } from 'lucide-react';
import l from '@/helper/en';
import type { ClientReview, OwnerReview } from '@/types/Review';
import { Dialog } from '@/components/UI/Dialog';

type RatingModalBaseProps = {
  rentalId: string;
  targetName: string;
  onClose: () => void;
};

type RatingModalProps =
  | (RatingModalBaseProps & {
      reviewerRole: 'client';
      onSubmitted: (review: ClientReview) => void;
    })
  | (RatingModalBaseProps & {
      reviewerRole: 'owner';
      onSubmitted: (review: OwnerReview) => void;
    });

function StarPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (rating: number) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-ink-secondary">
        {label}
      </legend>
      <div className="mt-2 flex gap-1" aria-label={label}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            aria-label={`${rating} ${rating === 1 ? 'star' : 'stars'}`}
            aria-pressed={rating === value}
            onClick={() => onChange(rating)}
            className="rounded-lg p-1 text-border-strong transition-colors hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <Star
              className={`h-8 w-8 ${
                rating <= value ? 'fill-amber-400 text-amber-400' : ''
              }`}
            />
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function RatingModal(props: RatingModalProps) {
  const { rentalId, reviewerRole, targetName, onClose } = props;
  const [carRating, setCarRating] = useState(0);
  const [personRating, setPersonRating] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isClient = reviewerRole === 'client';
  const isComplete = personRating > 0 && (!isClient || carRating > 0);

  const handleSubmit = async () => {
    if (!isComplete || isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/rentals/${rentalId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isClient
            ? { carRating, ownerRating: personRating }
            : { clientRating: personRating }
        ),
      });
      const result: unknown = await response.json();

      if (!response.ok) {
        const message =
          typeof result === 'object' &&
          result !== null &&
          'message' in result &&
          typeof result.message === 'string'
            ? result.message
            : l.reviews.genericError;

        throw new Error(message);
      }

      const submittedAt = new Date();

      if (props.reviewerRole === 'client') {
        props.onSubmitted({
          carRating,
          ownerRating: personRating,
          submittedAt,
        });
      } else {
        props.onSubmitted({ clientRating: personRating, submittedAt });
      }
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : l.reviews.genericError
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      onClose={onClose}
      ariaLabelledBy="rating-modal-title"
      closeOnBackdrop
      dismissible={!isSubmitting}
      overlayClassName="z-50 bg-ink/60 p-4 backdrop-blur-sm"
      panelClassName="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-white shadow-xl"
    >
      {/* Prevent rating submission state from escaping its modal boundary. */}
      <div className="bg-ink-secondary px-6 py-5 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand/70">
              {l.reviews.tripComplete}
            </p>
            <h2
              id="rating-modal-title"
              className="mt-1 font-heading text-xl font-bold"
            >
              {isClient ? l.reviews.clientTitle : l.reviews.ownerTitle}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close rating form"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full p-1.5 text-border-strong transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-sm leading-6 text-border-strong">
          {isClient ? l.reviews.clientDescription : l.reviews.ownerDescription}
        </p>
      </div>

      <div className="space-y-5 p-6">
        {isClient && (
          <StarPicker
            label={l.reviews.rateCar}
            value={carRating}
            onChange={setCarRating}
          />
        )}
        <StarPicker
          label={
            isClient
              ? `${l.reviews.rateOwner}: ${targetName}`
              : `${l.reviews.rateClientLabel}: ${targetName}`
          }
          value={personRating}
          onChange={setPersonRating}
        />

        {error && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex min-h-11 flex-1 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-body transition-colors hover:bg-surface"
          >
            {l.reviews.cancel}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isComplete || isSubmitting}
            className="flex min-h-11 flex-1 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-border-strong"
          >
            {isSubmitting ? l.reviews.submitting : l.reviews.submit}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
