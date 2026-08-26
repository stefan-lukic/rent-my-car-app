'use client';

import { useEffect, useId, useRef, useState } from 'react';
import l from '@/helper/en';
import FormInput, { labelClasses } from './FormInput';

interface GooglePlace {
  formattedAddress?: string;
  fetchFields: (options: { fields: string[] }) => Promise<void>;
}

interface GooglePlacePrediction {
  toPlace: () => GooglePlace;
}

interface GooglePlaceSelectEvent extends Event {
  placePrediction: GooglePlacePrediction;
}

interface GooglePlaceAutocompleteElement extends HTMLElement {
  value: string;
  placeholder: string;
  includedRegionCodes: string[];
  includedPrimaryTypes: string[];
}

interface GooglePlaceAutocompleteConstructor {
  new (): GooglePlaceAutocompleteElement;
}

declare global {
  interface Window {
    google?: {
      maps: {
        importLibrary: (library: 'places') => Promise<{
          PlaceAutocompleteElement: GooglePlaceAutocompleteConstructor;
        }>;
      };
    };
  }
}

interface AddressAutocompleteInputProps {
  label: string;
  name: string;
  value: string;
  city: string;
  placeholder?: string;
  onValueChange: (value: string) => void;
  required?: boolean;
}

let googleMapsScriptPromise: Promise<void> | null = null;

function waitForGoogleMaps(timeoutMs = 10000): Promise<void> {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const checkGoogleMaps = () => {
      if (window.google?.maps?.importLibrary) {
        resolve();
        return;
      }

      if (Date.now() - startedAt >= timeoutMs) {
        reject(new Error('Google Maps did not become ready in time.'));
        return;
      }

      window.setTimeout(checkGoogleMaps, 50);
    };

    checkGoogleMaps();
  });
}

function loadGoogleMaps(apiKey: string): Promise<void> {
  if (window.google?.maps?.importLibrary) return Promise.resolve();
  if (googleMapsScriptPromise) return googleMapsScriptPromise;

  googleMapsScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-rentmycar-google-maps]'
    );

    if (existingScript) {
      void waitForGoogleMaps().then(resolve).catch(reject);
      existingScript.addEventListener(
        'error',
        () => reject(new Error('Google Maps failed to load.')),
        { once: true }
      );
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&loading=async&libraries=places&v=weekly`;
    script.async = true;
    script.dataset.rentmycarGoogleMaps = 'true';
    script.addEventListener(
      'load',
      () => void waitForGoogleMaps().then(resolve).catch(reject),
      { once: true }
    );
    script.addEventListener(
      'error',
      () => reject(new Error('Google Maps failed to load.')),
      { once: true }
    );
    document.head.appendChild(script);
  });

  return googleMapsScriptPromise;
}

export default function AddressAutocompleteInput({
  label,
  name,
  value,
  city,
  placeholder,
  onValueChange,
  required = false,
}: AddressAutocompleteInputProps) {
  const generatedId = useId();
  const inputId = `${name}-${generatedId.replace(/:/g, '')}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<GooglePlaceAutocompleteElement | null>(null);
  const onValueChangeRef = useRef(onValueChange);
  const valueRef = useRef(value);
  const [isReady, setIsReady] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_PLACES_API_KEY?.trim();
  const addressPlaceholder = placeholder?.trim() || l.cars.egStreetLocation;

  useEffect(() => {
    onValueChangeRef.current = onValueChange;
  }, [onValueChange]);

  useEffect(() => {
    if (!apiKey || !city || !containerRef.current) return;

    let cancelled = false;
    let autocomplete: GooglePlaceAutocompleteElement | null = null;
    let removeListeners: (() => void) | undefined;

    const initializeAutocomplete = async () => {
      try {
        setIsReady(false);
        setLoadFailed(false);
        await loadGoogleMaps(apiKey);
        if (cancelled || !window.google || !containerRef.current) return;

        const { PlaceAutocompleteElement } =
          await window.google.maps.importLibrary('places');
        if (cancelled || !containerRef.current) return;

        autocomplete = new PlaceAutocompleteElement();
        autocomplete.id = inputId;
        autocomplete.value = valueRef.current;
        autocomplete.placeholder = `${addressPlaceholder}, ${city}`;
        autocomplete.includedRegionCodes = ['rs'];
        autocomplete.includedPrimaryTypes = [
          'street_address',
          'route',
          'premise',
        ];
        autocomplete.className = 'rentmycar-place-autocomplete';
        autocomplete.style.display = 'block';
        autocomplete.style.width = '100%';
        autocomplete.style.colorScheme = 'light';
        autocomplete.setAttribute('aria-labelledby', `${inputId}-label`);

        const handleInput = () => {
          if (autocomplete) onValueChangeRef.current(autocomplete.value);
        };

        const handlePlaceSelect = async (event: Event) => {
          const { placePrediction } = event as GooglePlaceSelectEvent;
          const place = placePrediction.toPlace();
          await place.fetchFields({ fields: ['formattedAddress'] });

          if (!cancelled && place.formattedAddress) {
            onValueChangeRef.current(place.formattedAddress);
          }
        };

        autocomplete.addEventListener('input', handleInput);
        autocomplete.addEventListener('gmp-select', handlePlaceSelect);
        containerRef.current.replaceChildren(autocomplete);
        autocompleteRef.current = autocomplete;
        setIsReady(true);

        removeListeners = () => {
          autocomplete?.removeEventListener('input', handleInput);
          autocomplete?.removeEventListener('gmp-select', handlePlaceSelect);
        };
      } catch {
        if (!cancelled) {
          setIsReady(false);
          setLoadFailed(true);
        }
      }
    };

    void initializeAutocomplete();

    return () => {
      cancelled = true;
      removeListeners?.();
      autocomplete?.remove();
      autocompleteRef.current = null;
    };
  }, [addressPlaceholder, apiKey, city, inputId]);

  useEffect(() => {
    valueRef.current = value;
    if (autocompleteRef.current && autocompleteRef.current.value !== value) {
      autocompleteRef.current.value = value;
    }
  }, [value]);

  return (
    <div className="w-full">
      {isReady ? (
        <label
          id={`${inputId}-label`}
          htmlFor={inputId}
          className={labelClasses}
        >
          {label}
        </label>
      ) : null}

      <div ref={containerRef} className={isReady ? 'block' : 'hidden'} />

      {!isReady ? (
        <FormInput
          label={label}
          id={inputId}
          name={name}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder={
            !city
              ? l.cars.selectCityFirst
              : apiKey && !loadFailed
                ? l.cars.loadingAddressSuggestions
                : addressPlaceholder
          }
          disabled={!city || Boolean(apiKey && !loadFailed)}
          required={required}
        />
      ) : (
        <input type="hidden" name={name} value={value} />
      )}
    </div>
  );
}
