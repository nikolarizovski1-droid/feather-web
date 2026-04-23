'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AdvancedMarker, Map, useMapsLibrary } from '@vis.gl/react-google-maps';
import { MapPin, X } from 'lucide-react';

export interface PickedLocation {
  address: string;
  lat: number;
  lng: number;
  countryCode: string | null;
  city: string | null;
}

interface LocationPickerProps {
  value: PickedLocation | null;
  onChange: (v: PickedLocation | null) => void;
  disabled?: boolean;
}

export default function LocationPicker({ value, onChange, disabled }: LocationPickerProps) {
  const t = useTranslations('Onboarding.venue.location');
  const inputRef = useRef<HTMLInputElement>(null);
  const placesLib = useMapsLibrary('places');
  const [hasText, setHasText] = useState(Boolean(value?.address));
  const inputId = useId();

  useEffect(() => {
    if (!placesLib || !inputRef.current) return;
    const autocomplete = new placesLib.Autocomplete(inputRef.current, {
      fields: ['formatted_address', 'geometry.location', 'address_components', 'name'],
    });
    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry?.location) return;
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const address = place.formatted_address ?? place.name ?? inputRef.current?.value ?? '';
      let countryCode: string | null = null;
      let city: string | null = null;
      for (const comp of place.address_components ?? []) {
        if (comp.types.includes('country')) countryCode = comp.short_name.toUpperCase();
        if (!city && comp.types.includes('locality')) city = comp.long_name;
        else if (!city && comp.types.includes('postal_town')) city = comp.long_name;
        else if (!city && comp.types.includes('administrative_area_level_2')) city = comp.long_name;
      }
      if (inputRef.current) inputRef.current.value = address;
      setHasText(true);
      onChange({ address, lat, lng, countryCode, city });
    });
    return () => listener.remove();
  }, [placesLib, onChange]);

  function clear() {
    if (inputRef.current) inputRef.current.value = '';
    setHasText(false);
    onChange(null);
    inputRef.current?.focus();
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-ink-08">{t('label')}</label>
      <div className="relative">
        <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-05 pointer-events-none" />
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          defaultValue={value?.address ?? ''}
          onInput={(e) => setHasText(e.currentTarget.value.length > 0)}
          placeholder={t('placeholder')}
          disabled={disabled}
          autoComplete="off"
          className="w-full pl-10 pr-10 py-3 text-base rounded-xl border border-black/10 bg-card text-ink-08 placeholder:text-ink-06 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
        />
        {hasText && !disabled && (
          <button
            type="button"
            onClick={clear}
            aria-label={t('clear')}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-ink-05 hover:text-ink-08 hover:bg-black/5"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <p className="text-xs text-ink-05">{t('hint')}</p>
      {value && (
        <div className="mt-1 rounded-xl overflow-hidden border border-black/10">
          <Map
            key={`${value.lat},${value.lng}-${value.address}`}
            style={{ width: '100%', height: '200px' }}
            defaultCenter={{ lat: value.lat, lng: value.lng }}
            defaultZoom={16}
            gestureHandling="cooperative"
            disableDefaultUI
            mapId="DEMO_MAP_ID"
          >
            <AdvancedMarker
              position={{ lat: value.lat, lng: value.lng }}
              draggable
              onDragEnd={(e) => {
                const ll = e.latLng;
                if (ll) onChange({ ...value, lat: ll.lat(), lng: ll.lng() });
              }}
            />
          </Map>
        </div>
      )}
    </div>
  );
}
