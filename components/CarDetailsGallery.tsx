'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Images } from 'lucide-react';
import l from '@/helper/en';

interface CarDetailsGalleryProps {
  images: string[];
  carName: string;
}

export default function CarDetailsGallery({
  images,
  carName,
}: CarDetailsGalleryProps) {
  const galleryImages = images.length > 0 ? images : ['/placeholder-car.svg'];
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <section aria-label={l.carDetailsPage.photoGallery(carName)}>
      <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-slate-200 shadow-sm lg:aspect-[16/9]">
        <Image
          src={galleryImages[selectedIndex]}
          alt={l.carDetailsPage.photoAlt(carName, selectedIndex + 1)}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 760px"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/55 to-transparent" />

        <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-slate-950/75 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
          <Images className="h-4 w-4" />
          {selectedIndex + 1} / {galleryImages.length}
        </span>

        {galleryImages.length > 1 ? (
          <>
            <button
              type="button"
              aria-label={l.carDetailsPage.previousPhoto}
              disabled={selectedIndex === 0}
              onClick={() => setSelectedIndex((index) => index - 1)}
              className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label={l.carDetailsPage.nextPhoto}
              disabled={selectedIndex === galleryImages.length - 1}
              onClick={() => setSelectedIndex((index) => index + 1)}
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>

      {galleryImages.length > 1 ? (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {galleryImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              aria-label={l.carDetailsPage.showPhoto(index + 1)}
              aria-current={selectedIndex === index ? 'true' : undefined}
              onClick={() => setSelectedIndex(index)}
              className={`relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${
                selectedIndex === index
                  ? 'border-blue-600'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="112px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
