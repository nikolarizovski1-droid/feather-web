'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getDeviceId } from '@/lib/device-id';
import { getCountries, getCurrencies, createVenue, updateLanguages } from '@/lib/onboarding-api';
import { OnboardingStep, ShopType } from '@/types/onboarding';
import type { Country, Currency, Language, CreateVenueRequest } from '@/types/onboarding';
import { useNotifications } from '@/hooks/useNotifications';
import OnboardingShell from '@/components/app/OnboardingShell';
import OnboardingButton from '@/components/app/OnboardingButton';
import OnboardingTextField from '@/components/app/OnboardingTextField';
import OnboardingSelect from '@/components/app/OnboardingSelect';
import CountryCombobox from '@/components/app/CountryCombobox';
import CurrencyCombobox from '@/components/app/CurrencyCombobox';
import LogoUpload from '@/components/app/LogoUpload';
import LocationPicker, { type PickedLocation } from '@/components/app/LocationPicker';
import { APIProvider } from '@vis.gl/react-google-maps';

const VENUE_DRAFT_KEY = 'onboarding_venue_draft';
const LOGO_DRAFT_MAX_BYTES = 500_000; // ~500KB — skip logo persistence past this to protect localStorage quota

interface VenueDraft {
  venueName?: string;
  city?: string;
  countryId?: number | '';
  currencyId?: number | '';
  languageId?: number | '';
  shopType?: ShopType;
  authKey?: string;
  logoDataUrl?: string;
  location?: PickedLocation;
}

type Field = 'venueName' | 'city' | 'countryId' | 'shopType' | 'authKey' | 'languageId' | 'currencyId';
const FIELD_ORDER: Field[] = ['venueName', 'city', 'countryId', 'shopType', 'authKey', 'languageId', 'currencyId'];

export default function CreateVenuePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError } = useNotifications();
  const t = useTranslations('Onboarding.venue');
  const tc = useTranslations('Onboarding.common');

  const [countries, setCountries] = useState<Country[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [venueName, setVenueName] = useState('');
  const [city, setCity] = useState('');
  const [countryId, setCountryId] = useState<number | ''>('');
  const [currencyId, setCurrencyId] = useState<number | ''>('');
  const [languageId, setLanguageId] = useState<number | ''>('');
  const [shopType, setShopType] = useState<ShopType>(ShopType.woocommerce);
  const [authKey, setAuthKey] = useState('');
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [location, setLocation] = useState<PickedLocation | null>(null);
  const [touched, setTouched] = useState<Record<Field, boolean>>({
    venueName: false, city: false, countryId: false, shopType: false,
    authKey: false, languageId: false, currencyId: false,
  });

  const venueNameRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLButtonElement>(null);
  const shopTypeRef = useRef<HTMLSelectElement>(null);
  const authKeyRef = useRef<HTMLInputElement>(null);
  const languageRef = useRef<HTMLSelectElement>(null);
  const currencyRef = useRef<HTMLButtonElement>(null);

  const selectedCountry = countries.find((c) => c.id === countryId) ?? null;
  const hasMultipleShopTypes = (selectedCountry?.supportedShopTypes?.length ?? 0) > 1;

  const languages: Language[] = [
    { id: 1, code: 'en', name: t('languages.english') },
    { id: 2, code: 'mk', name: t('languages.macedonian') },
    { id: 3, code: 'sq', name: t('languages.albanian') },
    { id: 4, code: 'bg', name: t('languages.bulgarian') },
    { id: 5, code: 'hr', name: t('languages.croatian') },
    { id: 6, code: 'ro', name: t('languages.romanian') },
    { id: 7, code: 'sv', name: t('languages.swedish') },
    { id: 8, code: 'tr', name: t('languages.turkish') },
    { id: 9, code: 'rs', name: t('languages.serbian') },
  ];

  function computeErrors(): Partial<Record<Field, string>> {
    const e: Partial<Record<Field, string>> = {};
    if (!venueName.trim()) e.venueName = t('errors.venueName');
    if (!city.trim()) e.city = t('errors.city');
    if (countryId === '') e.countryId = t('errors.country');
    if (shopType === ShopType.hype && !authKey.trim()) e.authKey = t('errors.authKey');
    if (languageId === '') e.languageId = t('errors.language');
    if (currencyId === '') e.currencyId = t('errors.currency');
    return e;
  }

  const errors = computeErrors();

  function errorFor(f: Field): string | undefined {
    return touched[f] ? errors[f] : undefined;
  }

  function markTouched(f: Field) {
    setTouched((t) => ({ ...t, [f]: true }));
  }

  function onLocationPick(picked: PickedLocation | null) {
    setLocation(picked);
    if (!picked) return;
    if (!city.trim() && picked.city) setCity(picked.city);
    if (countryId === '' && picked.countryCode) {
      const match = countries.find((c) => c.code?.toUpperCase() === picked.countryCode);
      if (match) setCountryId(match.id);
    }
  }

  const hydratedRef = useRef(false);

  useEffect(() => {
    getCountries().then(setCountries).catch(console.error);
    getCurrencies().then(setCurrencies).catch(console.error);

    try {
      const raw = localStorage.getItem(VENUE_DRAFT_KEY);
      if (raw) {
        const d: VenueDraft = JSON.parse(raw);
        if (d.venueName) setVenueName(d.venueName);
        if (d.city) setCity(d.city);
        if (d.countryId) setCountryId(d.countryId);
        if (d.currencyId) setCurrencyId(d.currencyId);
        if (d.languageId) setLanguageId(d.languageId);
        if (d.shopType !== undefined) setShopType(d.shopType);
        if (d.authKey) setAuthKey(d.authKey);
        if (d.logoDataUrl) setLogoDataUrl(d.logoDataUrl);
        if (d.location) setLocation(d.location);
      }
    } catch {
      /* ignore malformed draft */
    }
    hydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    const draft: VenueDraft = { venueName, city, countryId, currencyId, languageId, shopType, authKey };
    if (logoDataUrl && logoDataUrl.length <= LOGO_DRAFT_MAX_BYTES) draft.logoDataUrl = logoDataUrl;
    if (location) draft.location = location;
    try {
      localStorage.setItem(VENUE_DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* quota or disabled storage — ignore */
    }
  }, [venueName, city, countryId, currencyId, languageId, shopType, authKey, logoDataUrl, location]);

  async function onSubmit() {
    const e = computeErrors();
    if (Object.keys(e).length > 0) {
      setTouched({
        venueName: true, city: true, countryId: true, shopType: true,
        authKey: true, languageId: true, currencyId: true,
      });
      const refMap: Record<Field, React.RefObject<HTMLElement | null>> = {
        venueName: venueNameRef,
        city: cityRef,
        countryId: countryRef,
        shopType: shopTypeRef,
        authKey: authKeyRef,
        languageId: languageRef,
        currencyId: currencyRef,
      };
      const first = FIELD_ORDER.find((f) => e[f]);
      if (first) refMap[first].current?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const deviceId = getDeviceId();
      const request: CreateVenueRequest = {
        name: venueName,
        city,
        countryId: countryId as number,
        currencyId: currencyId as number,
        shop_status_id: 2,
        shop_onboarding_status_id: 1,
        creator_device_id: deviceId,
        shop_type: shopType,
      };

      if (shopType === ShopType.hype) request.auth_key = authKey;
      if (logoDataUrl) request.catalogue_icon = logoDataUrl.replace(/^data:[^;]+;base64,/, '');
      if (location) {
        request.location = {
          name: 'Main',
          location_address_name: location.address,
          lat: location.lat,
          lng: location.lng,
          is_pickup_location: true,
        };
      }

      const sriParam = searchParams.get('sri');
      if (sriParam && /^\d+$/.test(sriParam)) request.sales_representative_id = parseInt(sriParam, 10);

      const response = await createVenue(request);
      if (response) {
        const shopData = { ...response, storeType: (response as Record<string, unknown>).storeType ?? (response as Record<string, unknown>).store_type };
        localStorage.setItem('onboarding_shop_data', JSON.stringify(shopData));

        if (languageId && response.id) {
          try { await updateLanguages(response.id, [{ id: languageId as number, is_default: true }]); } catch { /* continue */ }
        }

        localStorage.setItem('onboarding_current_step', String(OnboardingStep.CreateUser));
        localStorage.removeItem(VENUE_DRAFT_KEY);
        router.push('./user');
      }
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : t('errors.failed'));
    } finally {
      setIsSubmitting(false);
    }
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <APIProvider apiKey={apiKey ?? ''}>
    <OnboardingShell
      title={t('title')}
      isSubmitting={isSubmitting}
      loadingMessage={t('loading')}
      footer={<OnboardingButton loading={isSubmitting} onClick={onSubmit}>{tc('continue')}</OnboardingButton>}
    >
      <div className="flex flex-col gap-5">
        <div className="flex justify-center pt-1 pb-1">
          <LogoUpload value={logoDataUrl} onChange={setLogoDataUrl} disabled={isSubmitting} />
        </div>

        <OnboardingTextField
          ref={venueNameRef}
          label={t('venueName')}
          placeholder={t('venueNamePlaceholder')}
          required
          value={venueName}
          onChange={setVenueName}
          onBlur={() => markTouched('venueName')}
          error={errorFor('venueName')}
          name="organization"
          autoComplete="organization"
        />

        <LocationPicker value={location} onChange={onLocationPick} disabled={isSubmitting} />

        <OnboardingTextField
          ref={cityRef}
          label={t('city')}
          placeholder={t('cityPlaceholder')}
          required
          value={city}
          onChange={setCity}
          onBlur={() => markTouched('city')}
          error={errorFor('city')}
          name="city"
          autoComplete="address-level2"
        />

        {/* Country */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center text-sm font-medium text-ink-08">{t('country')}<span className="text-ink-05 ml-0.5" aria-hidden="true">*</span></label>
          <CountryCombobox
            ref={countryRef}
            countries={countries}
            value={countryId}
            onChange={(id) => { setCountryId(id); setShopType(ShopType.woocommerce); markTouched('countryId'); }}
            onBlur={() => markTouched('countryId')}
            error={errorFor('countryId')}
            placeholder={tc('selectCountry')}
            ariaLabel={tc('country')}
          />
          {errorFor('countryId') && (
            <span role="alert" className="text-xs text-brand mt-0.5">{errorFor('countryId')}</span>
          )}
        </div>

        {/* Shop type */}
        {hasMultipleShopTypes && (
          <OnboardingSelect
            ref={shopTypeRef}
            label={t('shopType')}
            required
            value={shopType}
            onChange={(v) => setShopType(Number(v))}
          >
            {selectedCountry?.supportedShopTypes?.map((type) => (
              <option key={type} value={type}>{type === ShopType.woocommerce ? 'Feather' : 'Hype'}</option>
            ))}
          </OnboardingSelect>
        )}

        {shopType === ShopType.hype && (
          <OnboardingTextField
            ref={authKeyRef}
            label={t('authKey')}
            placeholder={t('authKeyPlaceholder')}
            required
            type="password"
            value={authKey}
            onChange={setAuthKey}
            onBlur={() => markTouched('authKey')}
            error={errorFor('authKey')}
          />
        )}

        {/* Language */}
        <OnboardingSelect
          ref={languageRef}
          label={t('language')}
          required
          value={languageId}
          onChange={(v) => { setLanguageId(Number(v) || ''); markTouched('languageId'); }}
          onBlur={() => markTouched('languageId')}
          error={errorFor('languageId')}
        >
          <option value="">{t('selectLanguage')}</option>
          {languages.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </OnboardingSelect>

        {/* Currency */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center text-sm font-medium text-ink-08">{t('currency')}<span className="text-ink-05 ml-0.5" aria-hidden="true">*</span></label>
          <CurrencyCombobox
            ref={currencyRef}
            currencies={currencies}
            value={currencyId}
            onChange={(id) => { setCurrencyId(id); markTouched('currencyId'); }}
            onBlur={() => markTouched('currencyId')}
            error={errorFor('currencyId')}
            placeholder={t('selectCurrency')}
            ariaLabel={t('currency')}
          />
          {errorFor('currencyId') && (
            <span role="alert" className="text-xs text-brand mt-0.5">{errorFor('currencyId')}</span>
          )}
        </div>
      </div>
    </OnboardingShell>
    </APIProvider>
  );
}
