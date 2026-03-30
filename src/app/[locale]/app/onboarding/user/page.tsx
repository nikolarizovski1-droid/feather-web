'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCountries, createUser, startDomainCreation } from '@/lib/onboarding-api';
import { OnboardingStep, ShopType } from '@/types/onboarding';
import type { Country, CreateUserRequest, UserCredentials } from '@/types/onboarding';
import { useNotifications } from '@/hooks/useNotifications';
import { events } from '@/lib/analytics';
import OnboardingShell from '@/components/app/OnboardingShell';
import OnboardingButton from '@/components/app/OnboardingButton';
import OnboardingTextField from '@/components/app/OnboardingTextField';

const selectStyles = 'w-full px-4 py-3 rounded-xl border border-black/10 bg-card text-ink-08 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors';

export default function CreateUserPage() {
  const router = useRouter();
  const { showError } = useNotifications();

  const [countries, setCountries] = useState<Country[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [countryId, setCountryId] = useState<number | ''>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const selectedCountry = countries.find((c) => c.id === countryId);
  const phonePrefix = selectedCountry?.phonePrefix || '+389';

  const isValid =
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    countryId !== '' &&
    phoneNumber.trim().length >= 6 &&
    /^[^@]+@[^@]+\.[^@]+$/.test(email) &&
    password.length >= 6;

  useEffect(() => {
    getCountries().then(setCountries).catch(console.error);
  }, []);

  async function onSubmit() {
    if (!isValid) return;
    setIsSubmitting(true);

    try {
      const shopData = localStorage.getItem('onboarding_shop_data');
      if (!shopData) throw new Error('Shop data not found');
      const shop = JSON.parse(shopData);

      const fullPhone = phonePrefix + phoneNumber.replace(/\s+/g, '');
      const request: CreateUserRequest = {
        first_name: firstName,
        last_name: lastName,
        shop_id: shop.id,
        email,
        password,
        password_confirmation: password,
        phone: fullPhone,
      };

      await createUser(request);
      events.trialStart(localStorage.getItem('onboarding_plan') ?? undefined);

      const credentials: UserCredentials = { email, password };
      localStorage.setItem('onboarding_user_credentials', JSON.stringify(credentials));

      const isHype = String(shop?.storeType ?? shop?.store_type ?? '').toLowerCase() === 'hype';

      if (isHype) {
        localStorage.setItem('onboarding_current_step', String(OnboardingStep.CreateDomain));
        router.push('./waiting');
      } else {
        if (shop.id && shop.name) {
          const subdomain = shop.name.toLowerCase().replace(/[^a-z0-9]/g, '');
          startDomainCreation(shop.id, subdomain).catch(console.error);
        }
        localStorage.setItem('onboarding_current_step', String(OnboardingStep.CreateMenu));
        router.push('./menu');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create user';
      if (msg.toLowerCase().includes('email') && msg.toLowerCase().includes('unique')) {
        showError('The entered e-mail address is already in use. Enter a different one and try again.');
      } else {
        showError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <OnboardingShell
      title="Account"
      isSubmitting={isSubmitting}
      loadingMessage="Creating account..."
      footer={<OnboardingButton disabled={!isValid} loading={isSubmitting} onClick={onSubmit}>Continue</OnboardingButton>}
    >
      <div className="flex flex-col gap-5">
        <OnboardingTextField label="First Name" placeholder="ex. Sara" required value={firstName} onChange={setFirstName} autoCapitalize />
        <OnboardingTextField label="Last Name" placeholder="ex. Stojkova" required value={lastName} onChange={setLastName} autoCapitalize />

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center text-sm font-medium text-ink-08"><span className="text-brand mr-0.5">*</span>Phone Number</label>
          <div className="flex gap-2">
            <select value={countryId} onChange={(e) => setCountryId(Number(e.target.value) || '')} className="w-28 px-3 py-3 rounded-xl border border-black/10 bg-card text-ink-08 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors">
              <option value="">Prefix</option>
              {countries.filter((c) => c.phonePrefix).map((c) => <option key={c.id} value={c.id}>{c.phonePrefix}</option>)}
            </select>
            <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="ex. 78 123 456" className="flex-1 px-4 py-3 rounded-xl border border-black/10 bg-card text-ink-08 placeholder:text-ink-06 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors" />
          </div>
        </div>

        <OnboardingTextField label="Email Address" placeholder="ex. email@example.com" type="email" required value={email} onChange={setEmail} />
        <OnboardingTextField label="Password" placeholder="********************" type="password" required value={password} onChange={setPassword} errorMessage={password.length > 0 && password.length < 6 ? 'Password should be 6 characters minimum' : ''} />
      </div>
    </OnboardingShell>
  );
}
