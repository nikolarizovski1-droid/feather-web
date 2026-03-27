'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrencies } from '@/lib/onboarding-api';
import { compressImage, fileToDataURL } from '@/lib/image-compression';
import type { MenuProduct, MenuProductCategory } from '@/types/onboarding';
import OnboardingShell from '@/components/app/OnboardingShell';
import OnboardingButton from '@/components/app/OnboardingButton';
import OnboardingTextField from '@/components/app/OnboardingTextField';
import { ChevronLeft, Trash2, Image as ImageIcon } from 'lucide-react';

export default function EditMenuItemPage({ params }: { params: Promise<{ stableId: string }> }) {
  const { stableId } = use(params);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!product || !confirm('Remove this item from your menu?')) return;
    const updated = products.filter((p) => p.stableIdentifier !== product.stableIdentifier);
    localStorage.setItem('onboarding_menu_products', JSON.stringify(updated));
    router.push('../');
  }

  if (!product) return null;

  return (
    <OnboardingShell title="" footer={
      <div className="flex items-center gap-3">
        <div className="flex-1"><OnboardingButton disabled={!isValid} onClick={save}>Save</OnboardingButton></div>
        <button onClick={deleteProduct} className="w-12 h-12 rounded-lg bg-[#FF6064] text-white flex items-center justify-center shrink-0 hover:bg-[#e5565a]"><Trash2 size={20} /></button>
      </div>
    }>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push('../')} className="text-white hover:opacity-80"><ChevronLeft size={28} /></button>
        <h1 className="text-2xl font-bold text-white">Edit Product</h1>
      </div>

      <div className="flex flex-col gap-5">
        {/* Image */}
        {hasImage ? (
          <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-white/5">
            <img src={displaySrc} alt="" className="w-full h-full object-cover" />
            <button onClick={() => { setNewImagePreview(null); if (product) product.images = []; }} className="absolute bottom-3 right-3 bg-white/50 rounded-full px-4 py-2.5 text-[#252525] text-sm font-medium flex items-center gap-1.5 hover:bg-white/70">
              <Trash2 size={14} />Delete
            </button>
          </div>
        ) : (
          <div onClick={() => !isCompressing && fileInputRef.current?.click()} className={`relative w-full rounded-2xl bg-[#313131] border border-dashed border-white/20 p-6 text-center cursor-pointer hover:bg-[#3a3a3a] ${isCompressing ? 'pointer-events-none' : ''}`}>
            {isCompressing && (
              <div className="absolute inset-0 bg-black/70 rounded-2xl flex flex-col items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
                <p className="text-sm font-semibold text-white">Compressing image...</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
            <ImageIcon size={32} className="text-[#CFCFCF] mx-auto mb-2" />
            <p className="text-base font-bold text-white mb-1">Upload product image</p>
            <p className="text-sm text-white/80 mb-4">For best results, upload <strong>high-resolution</strong> images.</p>
            <span className="inline-block bg-white text-[#252525] rounded-full px-6 py-3 text-sm font-medium">Upload image from gallery</span>
          </div>
        )}

        {/* SKU + Price */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-white mb-2">SKU</label>
            <input value={sku} onChange={(e) => setSku(e.target.value)} className="w-full px-4 py-3.5 rounded-lg border border-[#7A7A7A] bg-[#252525]/70 text-white" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-white mb-2"><span className="text-[#FF6064] mr-0.5">*</span>Price</label>
            <input value={regularPrice} inputMode="decimal" placeholder={currencySymbol} onChange={(e) => setRegularPrice(e.target.value.replace(',', '.'))} className="w-full px-4 py-3.5 rounded-lg border border-[#7A7A7A] bg-[#252525]/70 text-white" />
          </div>
        </div>

        {/* Category */}
        {categories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-white mb-2"><span className="text-[#FF6064] mr-0.5">*</span>Category</label>
            <select value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)} className="w-full px-4 py-3.5 rounded-lg border border-[#7A7A7A] bg-[#252525]/70 text-white">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
        )}

        {/* Featured toggle */}
        <label className="flex items-center justify-between p-4 rounded-lg bg-[#252525]/70 border border-[#7A7A7A] cursor-pointer">
          <span className="text-sm font-medium text-white">Top Product</span>
          <div className="relative">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="sr-only peer" />
            <div className="w-12 h-7 rounded-full bg-[#555] peer-checked:bg-[#FF6064] transition-colors" />
            <div className="absolute top-[3px] left-[3px] w-[22px] h-[22px] rounded-full bg-white transition-transform peer-checked:translate-x-5" />
          </div>
        </label>

        <OnboardingTextField label="Product Name" placeholder="ex. Smoked Brisket Ftira" required value={name} onChange={setName} />
        <OnboardingTextField label="Description" placeholder="Short description" value={description} onChange={setDescription} />
        <OnboardingTextField label="Allergens" placeholder="Allergens in the product" value={allergens} onChange={setAllergens} />
      </div>
    </OnboardingShell>
  );
}
