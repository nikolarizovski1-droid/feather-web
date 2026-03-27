'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createMenu as apiCreateMenu, getProcessedMenuResponse, getAppConfigOnboarding, loginUser } from '@/lib/onboarding-api';
import { compressImage, fileToDataURL, fileToBase64 } from '@/lib/image-compression';
import { OnboardingStep } from '@/types/onboarding';
import type { MenuProduct, MenuProductCategory, MenuProductMetadata } from '@/types/onboarding';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import OnboardingShell from '@/components/app/OnboardingShell';
import OnboardingButton from '@/components/app/OnboardingButton';
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

  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [maxImages, setMaxImages] = useState(20);
  const [isCreatingMenu, setIsCreatingMenu] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isLoadingPrev, setIsLoadingPrev] = useState(false);
  const [hasPreviousImages, setHasPreviousImages] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

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

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files);
    if (selectedImages.length + files.length > maxImages) { showError(`Maximum ${maxImages} images allowed.`); return; }
    setIsCompressing(true);
    setLoadingMessage(files.length > 1 ? 'Uploading images...' : 'Uploading image...');
    try {
      for (const file of files) {
        const preview = await fileToDataURL(file);
        const compressed = await compressImage(file);
        const base64 = await fileToBase64(compressed);
        setSelectedImages((prev) => [...prev, { file, preview, compressed: base64 }]);
      }
    } finally { setIsCompressing(false); }
    e.target.value = '';
  }

  async function usePreviousImages() {
    const shopData = localStorage.getItem('onboarding_shop_data');
    if (!shopData) return;
    const shop = JSON.parse(shopData);
    setIsLoadingPrev(true);
    setLoadingMessage('Loading previous menu...');
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
    } catch { showError('Failed to load previous menu.'); }
    finally { setIsLoadingPrev(false); }
  }

  async function createMenuHandler() {
    if (selectedImages.length === 0) return;
    const shopData = localStorage.getItem('onboarding_shop_data');
    if (!shopData) { showError('Shop data not found.'); return; }
    const shop = JSON.parse(shopData);
    setIsCreatingMenu(true);
    setLoadingMessage('Generating menu\nPlease wait...');
    try {
      const imgs = selectedImages.map((i) => i.compressed!).filter(Boolean);
      const response = await apiCreateMenu(shop.id, imgs) as unknown as Record<string, unknown>;
      if (response && Array.isArray(response.products) && Array.isArray(response.categories)) {
        const { products, categories } = mapRawMenuData(response.categories as Record<string, unknown>[], response.products as Record<string, unknown>[]);
        localStorage.setItem('onboarding_menu_products', JSON.stringify(products));
        localStorage.setItem('onboarding_menu_categories', JSON.stringify(categories));
        localStorage.setItem('onboarding_current_step', String(OnboardingStep.EditMenu));
        router.push('./menu-overview');
      } else throw new Error('No products or categories found');
    } catch (err: unknown) { showError(err instanceof Error ? err.message : 'Failed to create menu'); setIsCreatingMenu(false); }
  }

  async function skipMenu() {
    const shopData = localStorage.getItem('onboarding_shop_data');
    if (!shopData) return;
    setIsSkipping(true);
    setLoadingMessage('Activating shop...');
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
    } catch { showError('Failed to activate shop.'); }
    finally { setIsSkipping(false); }
  }

  const isBusy = isCreatingMenu || isSkipping || isLoadingPrev || isCompressing;

  return (
    <OnboardingShell title="Create menu" isSubmitting={isBusy} loadingMessage={loadingMessage} footer={
      <div className="flex flex-col gap-3">
        <OnboardingButton disabled={selectedImages.length === 0} loading={isCreatingMenu} onClick={createMenuHandler}>Create menu</OnboardingButton>
        <OnboardingButton variant="secondary" disabled={isCreatingMenu || isSkipping} loading={isSkipping} onClick={skipMenu}>Skip</OnboardingButton>
      </div>
    }>
      <p className="text-base font-medium text-white mb-4">Upload images of your menu and we&apos;ll extract the categories and items.</p>

      {hasPreviousImages && (
        <button onClick={usePreviousImages} disabled={isBusy} className="w-full mb-4 py-4 rounded-2xl bg-[#FF6064] text-white font-semibold hover:bg-[#e5565a] disabled:opacity-50">Use previous images</button>
      )}

      {/* Upload card */}
      <div className="bg-[#313131] rounded-2xl p-6 mb-4 flex items-start gap-4">
        <div className="flex-1">
          <ImageIcon size={32} className="text-[#CFCFCF] mb-2" />
          <p className="text-sm font-semibold text-white mb-1">Upload image</p>
          <p className="text-[9px] text-white">For best results, upload <strong>high-resolution</strong> images.</p>
        </div>
        <label className={`shrink-0 bg-white text-[#252525] rounded-full px-6 py-3 text-[11px] font-medium cursor-pointer ${isCompressing ? 'opacity-80 pointer-events-none' : ''}`}>
          Upload image
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={onFileSelected} className="hidden" disabled={isCompressing} />
        </label>
      </div>

      {/* Image grid */}
      {selectedImages.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {selectedImages.map((img, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden aspect-[4/3]">
              <img src={img.preview} alt={`Menu ${i + 1}`} className="w-full h-full object-cover" />
              <button onClick={() => setSelectedImages((prev) => prev.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 bg-black/60 rounded-full p-1.5 text-white hover:bg-black/80">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </OnboardingShell>
  );
}
