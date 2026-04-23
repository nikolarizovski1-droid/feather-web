'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getCountries, createUser, startDomainCreation } from '@/lib/onboarding-api';
import { OnboardingStep } from '@/types/onboarding';
import type { Country, CreateUserRequest, UserCredentials } from '@/types/onboarding';
import { useNotifications } from '@/hooks/useNotifications';
import { events } from '@/lib/analytics';
import OnboardingShell from '@/components/app/OnboardingShell';
import OnboardingButton from '@/components/app/OnboardingButton';
import OnboardingTextField from '@/components/app/OnboardingTextField';
import CountryCombobox from '@/components/app/CountryCombobox';

const USER_DRAFT_KEY = 'onboarding_user_draft';

interface UserDraft {
  firstName?: string;
  lastName?: string;
  countryId?: number | '';
  phoneNumber?: string;
  email?: string;
  // password intentionally excluded — never persist credentials to localStorage
}

type Field = 'firstName' | 'lastName' | 'countryId' | 'phoneNumber' | 'email' | 'password';
const FIELD_ORDER: Field[] = ['firstName', 'lastName', 'countryId', 'phoneNumber', 'email', 'password'];

const EMAIL_RE = /^[^@]+@[^@]+\.[^@]+$/;

export default function CreateUserPage() {
  const router = useRouter();
  const { showError } = useNotifications();
  const t = useTranslations('Onboarding.user');
  const tc = useTranslations('Onboarding.common');

  const [countries, setCountries] = useState<Country[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [countryId, setCountryId] = useState<number | ''>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState<Record<Field, boolean>>({
    firstName: false, lastName: false, countryId: false, phoneNumber: false, email: false, password: false,
  });

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLButtonElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const selectedCountry = countries.find((c) => c.id === countryId);
  const phonePrefix = selectedCountry?.phonePrefix || '+389';

  function computeErrors(): Partial<Record<Field, string>> {
    const e: Partial<Record<Field, string>> = {};
    if (!firstName.trim()) e.firstName = t('errors.firstName');
    if (!lastName.trim()) e.lastName = t('errors.lastName');
    if (countryId === '') e.countryId = t('errors.country');
    if (!phoneNumber.trim()) e.phoneNumber = t('errors.phoneNumber');
    else if (phoneNumber.replace(/\s+/g, '').length < 6) e.phoneNumber = t('errors.phoneShort');
    if (!email.trim()) e.email = t('errors.email');
    else if (!EMAIL_RE.test(email)) e.email = t('errors.emailInvalid');
    if (!password) e.password = t('errors.password');
    else if (password.length < 6) e.password = t('errors.passwordShort');
    return e;
  }

  const errors = computeErrors();

  function errorFor(f: Field): string | undefined {
    return touched[f] ? errors[f] : undefined;
  }

  function markTouched(f: Field) {
    setTouched((t) => ({ ...t, [f]: true }));
  }

  const hydratedRef = useRef(false);

  useEffect(() => {
    getCountries().then(setCountries).catch(console.error);

    try {
      const raw = localStorage.getItem(USER_DRAFT_KEY);
      if (raw) {
        const d: UserDraft = JSON.parse(raw);
        if (d.firstName) setFirstName(d.firstName);
        if (d.lastName) setLastName(d.lastName);
        if (d.countryId) setCountryId(d.countryId);
        if (d.phoneNumber) setPhoneNumber(d.phoneNumber);
        if (d.email) setEmail(d.email);
      }
    } catch {
      /* ignore malformed draft */
    }
    hydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    const draft: UserDraft = { firstName, lastName, countryId, phoneNumber, email };
    try {
      localStorage.setItem(USER_DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* quota or disabled storage — ignore */
    }
  }, [firstName, lastName, countryId, phoneNumber, email]);

  async function onSubmit() {
    const e = computeErrors();
    if (Object.keys(e).length > 0) {
      setTouched({
        firstName: true, lastName: true, countryId: true, phoneNumber: true, email: true, password: true,
      });
      const refMap: Record<Field, React.RefObject<HTMLElement | null>> = {
        firstName: firstNameRef,
        lastName: lastNameRef,
        countryId: countryRef,
        phoneNumber: phoneRef,
        email: emailRef,
        password: passwordRef,
      };
      const first = FIELD_ORDER.find((f) => e[f]);
      if (first) refMap[first].current?.focus();
      return;
    }

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
      localStorage.removeItem(USER_DRAFT_KEY);

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
      const msg = err instanceof Error ? err.message : t('errors.failed');
      if (msg.toLowerCase().includes('email') && msg.toLowerCase().includes('unique')) {
        setTouched((prev) => ({ ...prev, email: true }));
        emailRef.current?.focus();
        showError(t('errors.emailInUse'));
      } else {
        showError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const phoneError = errorFor('phoneNumber') ?? errorFor('countryId');

  return (
    <OnboardingShell
      title={t('title')}
      isSubmitting={isSubmitting}
      loadingMessage={t('loading')}
      footer={<OnboardingButton loading={isSubmitting} onClick={onSubmit}>{tc('continue')}</OnboardingButton>}
    >
      <div className="flex flex-col gap-5">
        <OnboardingTextField
          ref={firstNameRef}
          label={t('firstName')}
          placeholder={t('firstNamePlaceholder')}
          required
          value={firstName}
          onChange={setFirstName}
          onBlur={() => markTouched('firstName')}
          error={errorFor('firstName')}
          name="given-name"
          autoComplete="given-name"
          autoCapitalize
        />
        <OnboardingTextField
          ref={lastNameRef}
          label={t('lastName')}
          placeholder={t('lastNamePlaceholder')}
          required
          value={lastName}
          onChange={setLastName}
          onBlur={() => markTouched('lastName')}
          error={errorFor('lastName')}
          name="family-name"
          autoComplete="family-name"
          autoCapitalize
        />

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center text-sm font-medium text-ink-08">{t('phoneNumber')}<span className="text-ink-05 ml-0.5" aria-hidden="true">*</span></label>
          <div className="flex gap-2">
            <CountryCombobox
              ref={countryRef}
              countries={countries}
              value={countryId}
              onChange={(id) => { setCountryId(id); markTouched('countryId'); }}
              onBlur={() => markTouched('countryId')}
              error={errorFor('countryId')}
              variant="prefix"
              placeholder={tc('prefix')}
              ariaLabel={tc('countryDialCode')}
            />
            <input
              ref={phoneRef}
              type="tel"
              name="tel-national"
              inputMode="tel"
              autoComplete="tel-national"
              aria-invalid={Boolean(errorFor('phoneNumber')) || undefined}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              onBlur={() => markTouched('phoneNumber')}
              placeholder={t('phonePlaceholder')}
              className={`flex-1 px-4 py-3 rounded-xl border bg-card text-ink-08 placeholder:text-ink-06 focus:outline-none focus:ring-2 transition-colors ${
                errorFor('phoneNumber')
                  ? 'border-brand focus:ring-brand/30 focus:border-brand'
                  : 'border-black/10 focus:ring-brand/20 focus:border-brand'
              }`}
            />
          </div>
          {phoneError && (
            <span role="alert" className="text-xs text-brand mt-0.5">{phoneError}</span>
          )}
        </div>

        <OnboardingTextField
          ref={emailRef}
          label={t('email')}
          placeholder={t('emailPlaceholder')}
          type="email"
          required
          value={email}
          onChange={setEmail}
          onBlur={() => markTouched('email')}
          error={errorFor('email')}
          name="email"
          autoComplete="email"
          inputMode="email"
        />
        <OnboardingTextField
          ref={passwordRef}
          label={t('password')}
          placeholder={t('passwordPlaceholder')}
          type="password"
          required
          value={password}
          onChange={setPassword}
          onBlur={() => markTouched('password')}
          error={errorFor('password')}
          name="new-password"
          autoComplete="new-password"
        />
      </div>
    </OnboardingShell>
  );
}
