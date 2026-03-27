'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getDeviceId } from '@/lib/device-id';
import { getCountries, getCurrencies, createVenue, updateLanguages } from '@/lib/onboarding-api';
import { OnboardingStep, ShopType } from '@/types/onboarding';
import type { Country, Currency, Language, CreateVenueRequest } from '@/types/onboarding';
import { useNotifications } from '@/hooks/useNotifications';
import OnboardingShell from '@/components/app/OnboardingShell';
import OnboardingButton from '@/components/app/OnboardingButton';
import OnboardingTextField from '@/components/app/OnboardingTextField';

export default function CreateVenuePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError } = useNotifications();

  const [countries, setCountries] = useState<Country[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [venueName, setVenueName] = useState('');
  const [city, setCity] = useState('');
  const [countryId, setCountryId] = useState<number | ''>('');
  const [currencyId, setCurrencyId] = useState<number | ''>('');
  const [secondCurrencyId, setSecondCurrencyId] = useState<number | ''>('');
  const [showSecondCurrency, setShowSecondCurrency] = useState(false);
  const [languageId, setLanguageId] = useState<number | ''>('');
  const [locationName, setLocationName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [shopType, setShopType] = useState<ShopType>(ShopType.woocommerce);
  const [authKey, setAuthKey] = useState('');
  const [logoBase64, setLogoBase64] = useState<string | null>(null);

  const selectedCountry = countries.find((c) => c.id === countryId) ?? null;
  const hasMultipleShopTypes = (selectedCountry?.supportedShopTypes?.length ?? 0) > 1;

  const languages: Language[] = [
    { id: 1, code: 'en', name: 'English' },
    { id: 2, code: 'mk', name: 'Macedonian' },
    { id: 3, code: 'sq', name: 'Albanian' },
  ];

  const isFormValid = venueName.trim() !== '' && city.trim() !== '' && countryId !== '' && currencyId !== '' && languageId !== '' && (shopType !== ShopType.hype || authKey.trim() !== '');

  useEffect(() => {
    getCountries().then(setCountries).catch(console.error);
    getCurrencies().then(setCurrencies).catch(console.error);
  }, []);

  async function onSubmit() {
    if (!isFormValid) return;
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

      if (secondCurrencyId) request.secondCurrencyId = secondCurrencyId as number;
      if (logoBase64) request.catalogue_icon = logoBase64;
      if (locationName || locationAddress) {
        request.location = { name: locationName, location_address_name: locationAddress, lat, lng, is_pickup_location: true };
      }
      if (shopType === ShopType.hype) request.auth_key = authKey;

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
        router.push('./user');
      }
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : 'Failed to create venue');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <OnboardingShell
      title="Venue"
      isSubmitting={isSubmitting}
      loadingMessage="Creating venue..."
      footer={<OnboardingButton disabled={!isFormValid} loading={isSubmitting} onClick={onSubmit}>Continue</OnboardingButton>}
    >
      <div className="flex flex-col gap-5">
        <OnboardingTextField label="Venue name" placeholder="ex. Aroma Cafe" required value={venueName} onChange={setVenueName} />
        <OnboardingTextField label="City" placeholder="ex. Skopje" required value={city} onChange={setCity} />

        {/* Country */}
        <div className="flex flex-col gap-1">
          <label className="flex items-center text-sm font-medium text-white"><span className="text-[#FF6064] mr-0.5">*</span>Country</label>
          <select value={countryId} onChange={(e) => { setCountryId(Number(e.target.value) || ''); setShopType(ShopType.woocommerce); }} className="w-full px-4 py-3.5 rounded-lg border border-[#7A7A7A] bg-[#252525]/70 text-white">
            <option value="">Select country</option>
            {countries.map((c) => <option key={c.id} value={c.id}>{c.countryFlag ? `${c.countryFlag} ` : ''}{c.name}</option>)}
          </select>
        </div>

        {/* Shop type */}
        {hasMultipleShopTypes && (
          <div className="flex flex-col gap-1">
            <label className="flex items-center text-sm font-medium text-white"><span className="text-[#FF6064] mr-0.5">*</span>Shop Type</label>
            <select value={shopType} onChange={(e) => setShopType(Number(e.target.value))} className="w-full px-4 py-3.5 rounded-lg border border-[#7A7A7A] bg-[#252525]/70 text-white">
              {selectedCountry?.supportedShopTypes?.map((t) => <option key={t} value={t}>{t === ShopType.woocommerce ? 'Feather' : 'Hype'}</option>)}
            </select>
          </div>
        )}

        {shopType === ShopType.hype && <OnboardingTextField label="Auth Key" placeholder="Enter Hype auth key" required type="password" value={authKey} onChange={setAuthKey} />}

        {/* Location */}
        <OnboardingTextField label="Location name" placeholder="ex. City Center" value={locationName} onChange={setLocationName} />
        <OnboardingTextField label="Address" placeholder="ex. Bul. Partizanski Odredi 1" value={locationAddress} onChange={setLocationAddress} />

        {/* Language */}
        <div className="flex flex-col gap-1">
          <label className="flex items-center text-sm font-medium text-white"><span className="text-[#FF6064] mr-0.5">*</span>Language</label>
          <select value={languageId} onChange={(e) => setLanguageId(Number(e.target.value) || '')} className="w-full px-4 py-3.5 rounded-lg border border-[#7A7A7A] bg-[#252525]/70 text-white">
            <option value="">Select language</option>
            {languages.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>

        {/* Currency */}
        <div className="flex flex-col gap-1">
          <label className="flex items-center text-sm font-medium text-white"><span className="text-[#FF6064] mr-0.5">*</span>Currency</label>
          <select value={currencyId} onChange={(e) => setCurrencyId(Number(e.target.value) || '')} className="w-full px-4 py-3.5 rounded-lg border border-[#7A7A7A] bg-[#252525]/70 text-white">
            <option value="">Select currency</option>
            {currencies.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.code}){c.symbol ? ` ${c.symbol}` : ''}</option>)}
          </select>
        </div>

        {!showSecondCurrency ? (
          <button type="button" onClick={() => setShowSecondCurrency(true)} className="flex items-center justify-between w-full px-4 py-3 rounded-lg border border-dashed border-white/20 text-[#CFCFCF] hover:text-white text-sm">
            <span>Add Additional Currency</span><span>+</span>
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">Additional Currency</span>
              <button type="button" onClick={() => { setShowSecondCurrency(false); setSecondCurrencyId(''); }} className="text-[#CFCFCF] hover:text-white text-sm">Remove</button>
            </div>
            <select value={secondCurrencyId} onChange={(e) => setSecondCurrencyId(Number(e.target.value) || '')} className="w-full px-4 py-3.5 rounded-lg border border-[#7A7A7A] bg-[#252525]/70 text-white">
              <option value="">Select currency</option>
              {currencies.filter((c) => c.id !== currencyId).map((c) => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
            </select>
          </div>
        )}
      </div>
    </OnboardingShell>
  );
}
