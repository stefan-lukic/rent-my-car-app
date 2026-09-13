import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AddressAutocompleteInput from './AddressAutocompleteInput';

const defaultProps = {
  label: 'Car Location',
  name: 'carLocation',
  value: '',
  city: 'Belgrade',
  placeholder: 'Start typing an address',
  onValueChange: vi.fn(),
  required: true,
};

const enableGooglePlaces = () => {
  const config = document.createElement('span');
  config.id = 'rentmycar-google-places-config';
  config.dataset.enabled = 'true';
  document.body.appendChild(config);
};

describe('AddressAutocompleteInput', () => {
  afterEach(() => {
    document.getElementById('rentmycar-google-places-config')?.remove();
    delete window.google;
    vi.clearAllMocks();
  });

  it('keeps manual address entry available without a Google API key', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    function TestForm() {
      const [value, setValue] = useState('');

      return (
        <AddressAutocompleteInput
          {...defaultProps}
          value={value}
          onValueChange={(nextValue) => {
            setValue(nextValue);
            handleValueChange(nextValue);
          }}
        />
      );
    }

    render(<TestForm />);

    await user.type(screen.getByLabelText(defaultProps.label), 'Trg Republike');

    expect(handleValueChange).toHaveBeenLastCalledWith('Trg Republike');
    expect(screen.getByLabelText(defaultProps.label)).toHaveValue(
      'Trg Republike'
    );
  });

  it('waits for a city before enabling address entry', () => {
    render(<AddressAutocompleteInput {...defaultProps} city="" />);

    expect(screen.getByLabelText(defaultProps.label)).toBeDisabled();
    expect(screen.getByLabelText(defaultProps.label)).toHaveAttribute(
      'placeholder',
      'Select a city first'
    );
  });

  it('uses a readable fallback when no placeholder is provided', () => {
    render(
      <AddressAutocompleteInput {...defaultProps} placeholder={undefined} />
    );

    expect(screen.getByLabelText(defaultProps.label)).toHaveAttribute(
      'placeholder',
      'Street location'
    );
  });

  it('keeps the fallback input disabled while Google suggestions load', () => {
    enableGooglePlaces();
    window.google = {
      maps: {
        importLibrary: vi.fn(() => new Promise<never>(() => {})),
      },
    };

    render(<AddressAutocompleteInput {...defaultProps} />);

    expect(screen.getByLabelText(defaultProps.label)).toBeDisabled();
    expect(screen.getByLabelText(defaultProps.label)).toHaveAttribute(
      'placeholder',
      'Loading address suggestions...'
    );
  });

  it('uses the selected formatted Google address', async () => {
    enableGooglePlaces();

    const autocompleteElement = document.createElement(
      'div'
    ) as unknown as HTMLElement & {
      value: string;
      placeholder: string;
      includedRegionCodes: string[];
      includedPrimaryTypes: string[];
    };
    autocompleteElement.value = '';

    const PlaceAutocompleteElement = function () {
      return autocompleteElement;
    } as unknown as new () => typeof autocompleteElement;

    window.google = {
      maps: {
        importLibrary: vi.fn().mockResolvedValue({ PlaceAutocompleteElement }),
      },
    };

    render(<AddressAutocompleteInput {...defaultProps} />);

    await waitFor(() => {
      expect(window.google?.maps.importLibrary).toHaveBeenCalledWith('places');
    });

    const placeSelectEvent = new Event('gmp-select');
    Object.assign(placeSelectEvent, {
      placePrediction: {
        toPlace: () => ({
          formattedAddress: 'Trg Republike 5, Beograd, Serbia',
          fetchFields: vi.fn().mockResolvedValue(undefined),
        }),
      },
    });

    await act(async () => {
      autocompleteElement.dispatchEvent(placeSelectEvent);
    });

    expect(defaultProps.onValueChange).toHaveBeenLastCalledWith(
      'Trg Republike 5, Beograd, Serbia'
    );
    expect(autocompleteElement.includedRegionCodes).toEqual(['rs']);
    expect(autocompleteElement.className).toBe('rentmycar-place-autocomplete');
    expect(autocompleteElement.style.colorScheme).toBe('light');
  });

  it('keeps form state synchronized while the user types', async () => {
    enableGooglePlaces();

    const autocompleteElement = document.createElement(
      'div'
    ) as unknown as HTMLElement & {
      value: string;
      placeholder: string;
      includedRegionCodes: string[];
      includedPrimaryTypes: string[];
    };
    autocompleteElement.value = '';

    const PlaceAutocompleteElement = function () {
      return autocompleteElement;
    } as unknown as new () => typeof autocompleteElement;

    window.google = {
      maps: {
        importLibrary: vi.fn().mockResolvedValue({ PlaceAutocompleteElement }),
      },
    };

    render(<AddressAutocompleteInput {...defaultProps} />);

    await waitFor(() => {
      expect(window.google?.maps.importLibrary).toHaveBeenCalled();
    });

    autocompleteElement.value = 'Trg';
    fireEvent.input(autocompleteElement);

    expect(defaultProps.onValueChange).toHaveBeenLastCalledWith('Trg');
  });

  it('waits for the Maps API supplied by the server-rendered script', async () => {
    enableGooglePlaces();

    const autocompleteElement = document.createElement(
      'div'
    ) as unknown as HTMLElement & {
      value: string;
      placeholder: string;
      includedRegionCodes: string[];
      includedPrimaryTypes: string[];
    };
    autocompleteElement.value = '';

    const PlaceAutocompleteElement = function () {
      return autocompleteElement;
    } as unknown as new () => typeof autocompleteElement;
    const importLibrary = vi
      .fn()
      .mockResolvedValue({ PlaceAutocompleteElement });

    render(<AddressAutocompleteInput {...defaultProps} />);

    window.google = { maps: { importLibrary } };

    await waitFor(() => {
      expect(importLibrary).toHaveBeenCalledWith('places');
    });
  });
});
