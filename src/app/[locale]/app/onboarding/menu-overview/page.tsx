'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getOnboardingStep, batchCreateCategories, batchCreateProducts, activateShop, loginUser, getCurrencies } from '@/lib/onboarding-api';
import { OnboardingStep } from '@/types/onboarding';
import type { MenuProduct, MenuProductCategory, MenuProductImage } from '@/types/onboarding';
import { useNotifications } from '@/hooks/useNotifications';
import { events } from '@/lib/analytics';
import { useAuth } from '@/hooks/useAuth';
import OnboardingShell from '@/components/app/OnboardingShell';
import OnboardingButton from '@/components/app/OnboardingButton';
import { Trash2, Pencil, Image as ImageIcon } from 'lucide-react';

function toBatchImage(img: MenuProductImage) {
  if (img.id != null) return { id: img.id };
  const s = img.src?.trim();
  if (!s) return null;
  if (s.startsWith('data:')) return { data: s, alt: img.alt, name: img.name };
  if (s.startsWith('http')) return { src: s, alt: img.alt, name: img.name };
  return null;
}

export default function MenuItemsOverviewPage() {
  const router = useRouter();
  const { showError } = useNotifications();
  const { setCredentials } = useAuth();
  const pollingRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const t = useTranslations('Onboarding.review');
  const tc = useTranslations('Onboarding.common');

  const [products, setProducts] = useState<MenuProduct[]>([]);
  const [categories, setCategories] = useState<MenuProductCategory[]>([]);
  const [currentCat, setCurrentCat] = useState('all');
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [onboardingStatus, setOnboardingStatus] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [failedImgs, setFailedImgs] = useState<Set<string>>(new Set());

  const isDomainReady = onboardingStatus !== null && onboardingStatus >= 18;
  const isButtonEnabled = isDomainReady && !isCreating;

  const filtered = currentCat === 'all'
    ? [...products].sort((a, b) => (a.menuOrder ?? 0) - (b.menuOrder ?? 0))
    : products.filter((p) => p.categories?.some((c) => c.slug === currentCat)).sort((a, b) => (a.menuOrder ?? 0) - (b.menuOrder ?? 0));

  const checkStatus = useCallback(async () => {
    try {
      const r = await getOnboardingStep();
      if (r) setOnboardingStatus(r.step);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const pd = localStorage.getItem('onboarding_menu_products');
    const cd = localStorage.getItem('onboarding_menu_categories');
    if (pd) setProducts(JSON.parse(pd));
    if (cd) setCategories(JSON.parse(cd).sort((a: MenuProductCategory, b: MenuProductCategory) => (a.menuOrder ?? 0) - (b.menuOrder ?? 0)));

    // Currency
    const shopData = localStorage.getItem('onboarding_shop_data');
    if (shopData) {
      const shop = JSON.parse(shopData);
      if (shop.currencySymbol) setCurrencySymbol(shop.currencySymbol);
      else if (shop.currency && shop.currency.length <= 4) setCurrencySymbol(shop.currency);
      else if (shop.currencyId) getCurrencies().then((cs) => { const c = cs.find((x) => x.id === shop.currencyId); setCurrencySymbol(c?.symbol ?? '$'); }).catch(() => {});
    }

    // Polling
    const storedStep = parseInt(localStorage.getItem('onboarding_current_step') || '0');
    setOnboardingStatus(storedStep);
    if (storedStep < 18) {
      checkStatus();
      pollingRef.current = setInterval(checkStatus, 10000);
    }
    return () => clearInterval(pollingRef.current);
  }, [checkStatus]);

  useEffect(() => {
    if (isDomainReady) clearInterval(pollingRef.current);
  }, [isDomainReady]);

  function deleteProduct(product: MenuProduct) {
    if (!confirm(t('removeItemConfirm', { name: product.name ?? '' }))) return;
    const updated = products.filter((p) => p.stableIdentifier !== product.stableIdentifier);
    setProducts(updated);
    localStorage.setItem('onboarding_menu_products', JSON.stringify(updated));
  }

  async function confirmAndContinue() {
    if (products.length === 0) { showError(t('errors.addAtLeastOne')); return; }
    if (!isDomainReady) { showError(t('errors.setupInProgress')); return; }
    setIsCreating(true);
    try {
      const shopData = localStorage.getItem('onboarding_shop_data');
      if (!shopData) throw new Error(tc('shopDataNotFound'));
      const shop = JSON.parse(shopData);

      // Create categories
      const catsToCreate = categories.filter((c) => c.name);
      let createdCats: MenuProductCategory[] = [];
      if (catsToCreate.length > 0) {
        for (let i = 0; i < catsToCreate.length; i += 100) {
          const chunk = catsToCreate.slice(i, i + 100);
          const created = await batchCreateCategories(shop.id, { create: chunk.map((c) => ({ name: c.name, description: c.description || '' })) });
          createdCats.push(...created);
          if (i + 100 < catsToCreate.length) await new Promise((r) => setTimeout(r, 500));
        }
      }

      // Create products
      const bodies: Record<string, unknown>[] = [];
      for (const product of products) {
        const catId = createdCats.find((c) => c.slug === product.categories?.[0]?.slug)?.id;
        const pd: Record<string, unknown> = { type: 'simple' };
        if (product.name) pd.name = product.name;
        if (catId) pd.categories = [{ id: catId }];
        if (product.regularPrice) pd.regular_price = String(product.regularPrice);
        if (product.sku) pd.sku = product.sku;
        if (product.description) pd.description = product.description;
        if (product.shortDescription) pd.short_description = product.shortDescription;
        if (product.featured) pd.featured = true;
        if (product.metadata) pd.meta_data = product.metadata.map((m) => ({ key: m.key, value: m.value }));
        if (product.images?.length) {
          const mapped = product.images.map(toBatchImage).filter(Boolean);
          if (mapped.length) pd.images = mapped;
        }
        bodies.push(pd);
      }
      for (let i = 0; i < bodies.length; i += 100) {
        await batchCreateProducts(shop.id, { create: bodies.slice(i, i + 100) });
        if (i + 100 < bodies.length) await new Promise((r) => setTimeout(r, 500));
      }

      await activateShop(shop.id);
      events.signupComplete();

      const creds = localStorage.getItem('onboarding_user_credentials');
      if (creds) {
        const { email, password } = JSON.parse(creds);
        const res = await loginUser(email, password);
        setCredentials(res.shopId, res.userId, res.token);
      }

      // Clear
      ['onboarding_current_step', 'onboarding_shop_data', 'onboarding_menu_products', 'onboarding_menu_categories', 'onboarding_user_credentials'].forEach((k) => localStorage.removeItem(k));
      localStorage.setItem('onboarding_current_step', String(OnboardingStep.Finished));
      router.replace('../../app/subscription');
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : t('errors.failed'));
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <OnboardingShell title={t('title')} isSubmitting={isCreating} loadingMessage={t('loadingCreation')} footer={
      <div>
        {!isButtonEnabled && !isCreating && (
          <p className="text-[13px] text-ink-05 mb-2">
            {onboardingStatus !== null && onboardingStatus < 18
              ? t('stillSettingUp')
              : t('reviewAndConfirm')}
          </p>
        )}
        <OnboardingButton disabled={!isButtonEnabled} loading={isCreating || !isDomainReady} onClick={confirmAndContinue}>
          {!isDomainReady ? t('loadingButton') : t('confirmAndContinue')}
        </OnboardingButton>
      </div>
    }>
      {/* Category tabs */}
      {categories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
          <button onClick={() => setCurrentCat('all')} className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${currentCat === 'all' ? 'bg-brand text-white' : 'bg-black/5 text-ink-05 hover:text-ink-08'}`}>{t('all')}</button>
          {categories.map((c) => (
            <button key={c.slug} onClick={() => setCurrentCat(c.slug || '')} className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${currentCat === c.slug ? 'bg-brand text-white' : 'bg-black/5 text-ink-05 hover:text-ink-08'}`}>{c.name}</button>
          ))}
        </div>
      )}

      {/* Products */}
      <div className="flex flex-col gap-2">
        {filtered.map((product) => {
          const imgSrc = product.images?.[0]?.src;
          const hasImg = !!imgSrc?.trim() && !failedImgs.has(product.stableIdentifier ?? '');
          return (
            <div key={product.stableIdentifier} onClick={() => router.push(`./menu-overview/edit/${product.stableIdentifier}`)} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-black/5 cursor-pointer hover:border-brand/20 hover:shadow-sm transition-all duration-200">
              {hasImg ? (
                <img src={imgSrc} alt={product.name} className="w-14 h-14 rounded-lg object-cover shrink-0" onError={() => setFailedImgs((p) => new Set(p).add(product.stableIdentifier ?? ''))} />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-black/5 flex items-center justify-center shrink-0"><ImageIcon size={20} className="text-ink-06" /></div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink-08 truncate">{product.name}</p>
                <p className="text-xs text-ink-05">{product.regularPrice != null ? `${currencySymbol}${product.regularPrice.toFixed(2)}` : '—'}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={(e) => { e.stopPropagation(); deleteProduct(product); }} className="p-2 text-ink-05 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                <Pencil size={14} className="text-ink-06" />
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <p className="text-center text-ink-05 py-8">{t('noProductsInCategory')}</p>}
      </div>
    </OnboardingShell>
  );
}
