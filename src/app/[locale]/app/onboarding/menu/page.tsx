'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createMenu as apiCreateMenu, getProcessedMenuResponse, getAppConfigOnboarding, loginUser } from '@/lib/onboarding-api';
import { compressImage, fileToDataURL, fileToBase64 } from '@/lib/image-compression';
import { OnboardingStep } from '@/types/onboarding';
import type { MenuProduct, MenuProductCategory, MenuProductMetadata } from '@/types/onboarding';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import OnboardingShell from '@/components/app/OnboardingShell';
import OnboardingButton from '@/components/app/OnboardingButton';
import ConfirmationModal from '@/components/app/ConfirmationModal';
import { Trash2, Image as ImageIcon } from 'lucide-react';

interface SelectedImage { file: File; preview: string; compressed?: string }

function mapRawMenuData(rawCategories: Record<string, unknown>[], rawProducts: Record<string, unknown>[]): { categories: MenuProductCategory[]; products: MenuProduct[] } {
  const categories: MenuProductCategory[] = (rawCategories || []).map((c, i) => ({ name: c.name as string, slug: c.slug as string, description: c.description as string, menuOrder: i }));
  const catBySlug = new Map(categories.map((c) => [c.slug, c]));
  const products: MenuProduct[] = (rawProducts || []).map((p, i) => {
    const cats: MenuProductCategory[] = [];
    if (Array.isArray(p.categories)) (p.categories as string[]).forEach((s) => { const c = catBySlug.get(s); if (c) cats.push(c); });
    let meta: MenuProductMetadata[] | undefined;
    if (p.metadata && typeof p.metadata === 'object' && !Array.isArray(p.metadata)) meta = Object.entries(p.metadata as Record<string, unknown>).map(([k, v]) => ({ key: k, value: String(v ?? '') }));
    const rp = typeof p.regular_price === 'string' && (p.regular_price as string).trim() !== '' ? parseFloat(p.regular_price as string) : undefined;
    return { name: p.name as string, slug: p.slug as string, description: p.description as string, shortDescription: p.short_description as string, regularPrice: isNaN(rp as number) ? undefined : rp, categories: cats, metadata: meta, menuOrder: i, stableIdentifier: (p.slug as string) || `${i}-${(p.name as string) || 'item'}` };
  });
  return { categories, products };
}

export default function CreateMenuPage() {
  const router = useRouter();
  const { showError } = useNotifications();
  const { setCredentials } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('Onboarding.menu');
  const tc = useTranslations('Onboarding.common');

  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [maxImages, setMaxImages] = useState(20);
  const [isCreatingMenu, setIsCreatingMenu] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isLoadingPrev, setIsLoadingPrev] = useState(false);
  const [hasPreviousImages, setHasPreviousImages] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [pendingUndo, setPendingUndo] = useState<{ image: SelectedImage; index: number } | null>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(tc('loading'));

  useEffect(() => () => {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
  }, []);

  useEffect(() => {
    getAppConfigOnboarding().then((c) => { if (c.max_images) setMaxImages(c.max_images); }).catch(() => {});
    const shopData = localStorage.getItem('onboarding_shop_data');
    if (!shopData) return;
    const shop = JSON.parse(shopData);
    getProcessedMenuResponse(shop.id).then((r: unknown) => {
      const d = (r as Record<string, unknown>)?.processed_menu_response ?? (r as Record<string, unknown>)?.processedMenuResponse;
      if (d && Array.isArray((d as Record<string, unknown>).products) && ((d as Record<string, unknown>).products as unknown[]).length > 0) setHasPreviousImages(true);
    }).catch(() => {});
  }, []);

  async function processFiles(files: File[]) {
    if (files.length === 0) return;
    if (selectedImages.length + files.length > maxImages) {
      showError(t('maxImages', { n: maxImages }));
      return;
    }
    setIsCompressing(true);
    setLoadingMessage(files.length > 1 ? t('uploadingImages') : t('uploadingImage'));
    try {
      for (const file of files) {
        const preview = await fileToDataURL(file);
        const compressed = await compressImage(file);
        const base64 = await fileToBase64(compressed);
        setSelectedImages((prev) => [...prev, { file, preview, compressed: base64 }]);
      }
    } finally { setIsCompressing(false); }
  }

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;
    await processFiles(Array.from(e.target.files));
    e.target.value = '';
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    if (!isDragOver) setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    void processFiles(files);
  }

  function deleteImage(idx: number) {
    const removed = selectedImages[idx];
    if (!removed) return;
    setSelectedImages((prev) => prev.filter((_, i) => i !== idx));
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setPendingUndo({ image: removed, index: idx });
    undoTimerRef.current = setTimeout(() => setPendingUndo(null), 5000);
  }

  function undoDelete() {
    if (!pendingUndo) return;
    const { image, index } = pendingUndo;
    setSelectedImages((prev) => {
      const next = [...prev];
      next.splice(Math.min(index, next.length), 0, image);
      return next;
    });
    setPendingUndo(null);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
  }

  async function usePreviousImages() {
    const shopData = localStorage.getItem('onboarding_shop_data');
    if (!shopData) return;
    const shop = JSON.parse(shopData);
    setIsLoadingPrev(true);
    setLoadingMessage(t('loadingPrev'));
    try {
      const response = await getProcessedMenuResponse(shop.id) as Record<string, unknown>;
      const d = response?.processed_menu_response ?? response?.processedMenuResponse;
      if (d) {
        const { products, categories } = mapRawMenuData((d as Record<string, unknown>).categories as Record<string, unknown>[], (d as Record<string, unknown>).products as Record<string, unknown>[]);
        localStorage.setItem('onboarding_menu_products', JSON.stringify(products));
        localStorage.setItem('onboarding_menu_categories', JSON.stringify(categories));
        localStorage.setItem('onboarding_current_step', String(OnboardingStep.EditMenu));
        router.push('./menu-overview');
      }
    } catch { showError(t('errors.failedLoadPrev')); }
    finally { setIsLoadingPrev(false); }
  }

  async function createMenuHandler() {
    if (selectedImages.length === 0) return;
    const shopData = localStorage.getItem('onboarding_shop_data');
    if (!shopData) { showError(tc('shopDataNotFound')); return; }
    const shop = JSON.parse(shopData);
    setIsCreatingMenu(true);
    setLoadingMessage(t('generating'));
    try {
      const imgs = selectedImages.map((i) => i.compressed!).filter(Boolean);
      const response = await apiCreateMenu(shop.id, imgs) as unknown as Record<string, unknown>;
      if (response && Array.isArray(response.products) && Array.isArray(response.categories)) {
        const { products, categories } = mapRawMenuData(response.categories as Record<string, unknown>[], response.products as Record<string, unknown>[]);
        localStorage.setItem('onboarding_menu_products', JSON.stringify(products));
        localStorage.setItem('onboarding_menu_categories', JSON.stringify(categories));
        localStorage.setItem('onboarding_current_step', String(OnboardingStep.EditMenu));
        router.push('./menu-overview');
      } else throw new Error(t('errors.noProducts'));
    } catch (err: unknown) { showError(err instanceof Error ? err.message : t('errors.failedCreate')); setIsCreatingMenu(false); }
  }

  async function skipMenu() {
    setShowSkipModal(false);
    const shopData = localStorage.getItem('onboarding_shop_data');
    if (!shopData) return;
    setIsSkipping(true);
    setLoadingMessage(t('activating'));
    try {
      const creds = localStorage.getItem('onboarding_user_credentials');
      if (creds) {
        const { email, password } = JSON.parse(creds);
        const res = await loginUser(email, password);
        setCredentials(res.shopId, res.userId, res.token);
        localStorage.removeItem('onboarding_user_credentials');
      }
      localStorage.setItem('onboarding_current_step', String(OnboardingStep.Finished));
      router.replace('../../app/subscription');
    } catch { showError(t('errors.failedActivate')); }
    finally { setIsSkipping(false); }
  }

  const isBusy = isCreatingMenu || isSkipping || isLoadingPrev || isCompressing;

  return (
    <OnboardingShell title={t('title')} isSubmitting={isBusy} loadingMessage={loadingMessage} footer={
      <div className="flex flex-col gap-3">
        <OnboardingButton disabled={selectedImages.length === 0} loading={isCreatingMenu} onClick={createMenuHandler}>{t('createMenu')}</OnboardingButton>
        <OnboardingButton variant="secondary" disabled={isCreatingMenu || isSkipping} loading={isSkipping} onClick={() => setShowSkipModal(true)}>{t('skip')}</OnboardingButton>
      </div>
    }>
      <p className="text-base font-medium text-ink-08 mb-4">{t('description')}</p>

      {hasPreviousImages && (
        <button onClick={usePreviousImages} disabled={isBusy} className="w-full mb-4 py-3.5 rounded-full bg-brand text-white font-semibold hover:bg-[#e5474b] disabled:opacity-50 transition-all duration-200 active:scale-[0.98]">{t('usePrevious')}</button>
      )}

      {/* Upload card — click anywhere or drop files */}
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative block bg-card border border-black/5 rounded-2xl p-6 mb-4 shadow-sm cursor-pointer transition-all ${
          isDragOver ? 'ring-2 ring-brand ring-inset bg-brand/5' : 'hover:border-black/10'
        } ${isCompressing ? 'opacity-80 pointer-events-none' : ''}`}
      >
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={onFileSelected} className="hidden" disabled={isCompressing} />
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <ImageIcon size={32} className="text-ink-05 mb-2" />
            <p className="text-sm font-semibold text-ink-08 mb-1">
              {isDragOver ? t('dropHere') : t('uploadImage')}
            </p>
            <p className="text-xs text-ink-05">{t('uploadHintStart')}<strong>{t('uploadHintStrong')}</strong>{t('uploadHintEnd')}</p>
            <p className="text-xs text-ink-05 mt-1">{t('formatsHint', { max: maxImages })}</p>
          </div>
          <span className="shrink-0 self-center bg-brand text-white rounded-full px-6 py-3 text-sm font-medium hover:bg-[#e5474b] transition-colors">
            {t('uploadImage')}
          </span>
        </div>
      </label>

      {pendingUndo && (
        <div role="status" aria-live="polite" className="flex items-center justify-between gap-3 bg-ink-08 text-white rounded-full px-4 py-2.5 mb-3 shadow-md">
          <span className="text-sm">{t('imageRemoved')}</span>
          <button
            type="button"
            onClick={undoDelete}
            className="text-sm font-semibold text-brand hover:text-white transition-colors px-2"
          >
            {tc('undo')}
          </button>
        </div>
      )}

      {/* Image grid */}
      {selectedImages.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {selectedImages.map((img, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden aspect-[4/3] border border-black/5">
              <img src={img.preview} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => deleteImage(i)} className="absolute top-2 right-2 bg-card/80 backdrop-blur-sm rounded-full p-1.5 text-ink-05 hover:text-red-600 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showSkipModal && (
        <ConfirmationModal
          title={t('skipConfirmTitle')}
          message={t('skipConfirm')}
          confirmText={t('skip')}
          cancelText={tc('keepGoing')}
          onConfirm={skipMenu}
          onCancel={() => setShowSkipModal(false)}
        />
      )}
    </OnboardingShell>
  );
}
