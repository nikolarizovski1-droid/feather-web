'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getCurrencies } from '@/lib/onboarding-api';
import { compressImage, fileToDataURL } from '@/lib/image-compression';
import type { MenuProduct, MenuProductCategory } from '@/types/onboarding';
import OnboardingShell from '@/components/app/OnboardingShell';
import OnboardingButton from '@/components/app/OnboardingButton';
import OnboardingTextField from '@/components/app/OnboardingTextField';
import { ChevronLeft, Trash2, Image as ImageIcon } from 'lucide-react';

const selectStyles = 'w-full px-4 py-3 rounded-xl border border-black/10 bg-card text-ink-08 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors';

export default function EditMenuItemPage({ params }: { params: Promise<{ stableId: string }> }) {
  const { stableId } = use(params);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('Onboarding.editItem');
  const tc = useTranslations('Onboarding.common');
  const tMenu = useTranslations('Onboarding.menu');

  const [products, setProducts] = useState<MenuProduct[]>([]);
  const [categories, setCategories] = useState<MenuProductCategory[]>([]);
  const [product, setProduct] = useState<MenuProduct | null>(null);
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [isCompressing, setIsCompressing] = useState(false);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);

  // Form
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [regularPrice, setRegularPrice] = useState('');
  const [description, setDescription] = useState('');
  const [allergens, setAllergens] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [featured, setFeatured] = useState(false);

  const hasImage = !!(newImagePreview ?? product?.images?.[0]?.src)?.trim();
  const displaySrc = newImagePreview ?? product?.images?.[0]?.src ?? '';
  const isValid = name.trim() !== '' && parseFloat(regularPrice.replace(',', '.')) > 0 && categorySlug.trim() !== '';

  useEffect(() => {
    const pd = localStorage.getItem('onboarding_menu_products');
    const cd = localStorage.getItem('onboarding_menu_categories');
    if (!pd) { router.replace('../'); return; }
    const allProducts: MenuProduct[] = JSON.parse(pd);
    const allCats: MenuProductCategory[] = cd ? JSON.parse(cd) : [];
    setProducts(allProducts);
    setCategories(allCats.sort((a, b) => (a.menuOrder ?? 0) - (b.menuOrder ?? 0)));
    const found = allProducts.find((p) => p.stableIdentifier === stableId);
    if (!found) { router.replace('../'); return; }
    setProduct(found);
    setName(found.name ?? '');
    setSku(found.sku ?? '');
    setRegularPrice(found.regularPrice != null ? String(found.regularPrice) : '');
    setDescription(found.description ?? '');
    setAllergens(found.shortDescription ?? '');
    setCategorySlug(found.categories?.[0]?.slug ?? '');
    setFeatured(found.featured ?? false);

    // Currency
    const shopData = localStorage.getItem('onboarding_shop_data');
    if (shopData) {
      const shop = JSON.parse(shopData);
      if (shop.currencySymbol) setCurrencySymbol(shop.currencySymbol);
      else if (shop.currency?.length <= 4) setCurrencySymbol(shop.currency);
      else if (shop.currencyId) getCurrencies().then((cs) => { const c = cs.find((x) => x.id === shop.currencyId); setCurrencySymbol(c?.symbol ?? '$'); }).catch(() => {});
    }
  }, [stableId, router]);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length || !product) return;
    setIsCompressing(true);
    try {
      const compressed = await compressImage(e.target.files[0]);
      const dataUrl = await fileToDataURL(compressed);
      setNewImagePreview(dataUrl);
      product.images = [{ src: dataUrl }];
    } finally { setIsCompressing(false); }
    e.target.value = '';
  }

  function save() {
    if (!isValid || !product) return;
    product.name = name.trim() || undefined;
    product.sku = sku.trim() || undefined;
    const num = parseFloat(regularPrice.replace(',', '.'));
    product.regularPrice = !isNaN(num) && num > 0 ? num : undefined;
    product.description = description.trim() || undefined;
    product.shortDescription = allergens.trim() || undefined;
    product.featured = featured;
    if (categorySlug) {
      const cat = categories.find((c) => c.slug === categorySlug);
      product.categories = cat ? [cat] : [];
    }
    localStorage.setItem('onboarding_menu_products', JSON.stringify(products));
    router.push('../');
  }

  function deleteProduct() {
    if (!product || !confirm(t('deleteConfirm'))) return;
    const updated = products.filter((p) => p.stableIdentifier !== product.stableIdentifier);
    localStorage.setItem('onboarding_menu_products', JSON.stringify(updated));
    router.push('../');
  }

  if (!product) return null;

  return (
    <OnboardingShell title="" footer={
      <div className="flex items-center gap-3">
        <div className="flex-1"><OnboardingButton disabled={!isValid} onClick={save}>{tc('save')}</OnboardingButton></div>
        <button onClick={deleteProduct} className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 hover:bg-red-100 transition-colors"><Trash2 size={20} /></button>
      </div>
    }>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push('../')} className="text-ink-08 hover:opacity-80"><ChevronLeft size={28} /></button>
        <h1 className="text-2xl font-bold text-ink-08">{t('title')}</h1>
      </div>

      <div className="flex flex-col gap-5">
        {/* Image */}
        {hasImage ? (
          <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-black/5">
            <img src={displaySrc} alt="" className="w-full h-full object-cover" />
            <button onClick={() => { setNewImagePreview(null); if (product) product.images = []; }} className="absolute bottom-3 right-3 bg-card/80 backdrop-blur-sm rounded-full px-4 py-2.5 text-ink-08 text-sm font-medium flex items-center gap-1.5 hover:bg-card transition-colors">
              <Trash2 size={14} />{tc('delete')}
            </button>
          </div>
        ) : (
          <div onClick={() => !isCompressing && fileInputRef.current?.click()} className={`relative w-full rounded-2xl bg-card border border-dashed border-black/10 p-6 text-center cursor-pointer hover:border-brand/30 transition-colors ${isCompressing ? 'pointer-events-none' : ''}`}>
            {isCompressing && (
              <div className="absolute inset-0 bg-card/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand border-t-transparent" />
                <p className="text-sm font-semibold text-ink-08">{t('compressing')}</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
            <ImageIcon size={32} className="text-ink-05 mx-auto mb-2" />
            <p className="text-base font-bold text-ink-08 mb-1">{t('uploadProductImage')}</p>
            <p className="text-sm text-ink-05 mb-4">{tMenu('uploadHintStart')}<strong>{tMenu('uploadHintStrong')}</strong>{tMenu('uploadHintEnd')}</p>
            <span className="inline-block bg-brand text-white rounded-full px-6 py-3 text-sm font-medium">{t('uploadFromGallery')}</span>
          </div>
        )}

        {/* SKU + Price */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-ink-08 mb-2">{t('sku')}</label>
            <input value={sku} onChange={(e) => setSku(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-black/10 bg-card text-ink-08 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-ink-08 mb-2"><span className="text-brand mr-0.5">*</span>{t('price')}</label>
            <input value={regularPrice} inputMode="decimal" placeholder={currencySymbol} onChange={(e) => setRegularPrice(e.target.value.replace(',', '.'))} className="w-full px-4 py-3 rounded-xl border border-black/10 bg-card text-ink-08 placeholder:text-ink-06 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors" />
          </div>
        </div>

        {/* Category */}
        {categories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-ink-08 mb-2"><span className="text-brand mr-0.5">*</span>{t('category')}</label>
            <select value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)} className={selectStyles}>
              <option value="">{t('selectCategory')}</option>
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
        )}

        {/* Featured toggle */}
        <label className="flex items-center justify-between p-4 rounded-xl bg-card border border-black/10 cursor-pointer">
          <span className="text-sm font-medium text-ink-08">{t('topProduct')}</span>
          <div className="relative">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="sr-only peer" />
            <div className="w-12 h-7 rounded-full bg-black/10 peer-checked:bg-brand transition-colors" />
            <div className="absolute top-[3px] left-[3px] w-[22px] h-[22px] rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
          </div>
        </label>

        <OnboardingTextField label={t('productName')} placeholder={t('productNamePlaceholder')} required value={name} onChange={setName} />
        <OnboardingTextField label={t('description')} placeholder={t('descriptionPlaceholder')} value={description} onChange={setDescription} />
        <OnboardingTextField label={t('allergens')} placeholder={t('allergensPlaceholder')} value={allergens} onChange={setAllergens} />
      </div>
    </OnboardingShell>
  );
}
