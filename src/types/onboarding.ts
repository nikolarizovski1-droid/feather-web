// ============================================
// ONBOARDING TYPES
// Migrated from Angular featherSubscriptionsWebApp
// ============================================

export enum OnboardingStep {
  CreateVenue = 0,
  CreateUser = 1,
  CreateDomain = 2,
  DNSCreated = 3,
  CPanelDomainCreated = 4,
  WPDatabaseCreated = 5,
  WPDatabaseUserCreated = 6,
  WPAssignedPrivilegesToDatabaseUser = 7,
  WPCoreDownloaded = 8,
  WPConfigCreated = 9,
  WPCoreInstalled = 10,
  WPPermalinksUpdated = 11,
  WoocommerceInstalled = 12,
  ProductPermalinkInstalled = 13,
  WoocommerceCountryUpdated = 14,
  WoocommerceCurrencyUpdated = 15,
  WPPricesFlushed = 16,
  WoocommerceAPIKeyCreated = 17,
  ShopReadyToUse = 18,
  CreateMenu = 19,
  EditMenu = 20,
  SetLanguages = 23,
  Finished = 24,
  LoginFailed = 25,
}

export enum ShopType {
  woocommerce = 2,
  hype = 3,
}

export interface Client {
  id?: number;
  name?: string;
  city?: string;
  countryId?: number;
  currencyId?: number;
  secondCurrencyId?: number;
  url?: string;
  consumerKey?: string;
  secret?: string;
  languages?: Language[];
  currency?: string;
  currencySymbol?: string;
  storeType?: string;
  store_type?: string;
  [key: string]: unknown;
}

export interface OnboardingStepResponse {
  shop: Client;
  step: number;
}

export interface Language {
  id: number;
  code: string;
  name: string;
  isDefault?: boolean;
}

export interface Country {
  id: number;
  name: string;
  code: string;
  countryFlag?: string;
  phonePrefix?: string;
  supportedShopTypes?: number[];
}

export interface Currency {
  id: number;
  name: string;
  code: string;
  symbol?: string;
}

export interface ClientLocation {
  id?: number;
  name?: string;
  locationAddressName?: string;
  lat?: number;
  lng?: number;
  isPickupLocation?: boolean;
}

export interface CreateVenueRequest {
  name: string;
  city: string;
  countryId: number;
  currencyId: number;
  secondCurrencyId?: number;
  shop_status_id: number;
  shop_onboarding_status_id: number;
  creator_device_id: string;
  catalogue_icon?: string;
  location?: {
    name: string;
    location_address_name: string;
    lat: number;
    lng: number;
    is_pickup_location: boolean;
  };
  sales_representative_id?: number;
  shop_type?: number;
  auth_key?: string;
}

export interface CreateVenueResponse {
  id: number;
  name: string;
  city: string;
  countryId: number;
  currencyId: number;
  storeType?: string;
  store_type?: string;
  [key: string]: unknown;
}

export interface CreateUserRequest {
  first_name: string;
  last_name: string;
  shop_id: number;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  profile_icon?: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  shopId: number;
  userId: number;
}

// --- Menu ---

export interface MenuProductCategory {
  id?: number;
  name: string;
  slug?: string;
  description?: string;
  menuOrder?: number;
}

export interface MenuProductImage {
  id?: number;
  src?: string;
  alt?: string;
  name?: string;
}

export interface MenuProductMetadata {
  key: string;
  value: string;
}

export interface MenuProduct {
  id?: number;
  name?: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  regularPrice?: number;
  salePrice?: number;
  sku?: string;
  categories?: MenuProductCategory[];
  images?: MenuProductImage[];
  metadata?: MenuProductMetadata[];
  menuOrder?: number;
  stableIdentifier?: string;
  featured?: boolean;
}

export interface CreateMenuResponse {
  products: MenuProduct[];
  categories: MenuProductCategory[];
}

export interface AppConfig {
  max_images?: number;
  [key: string]: unknown;
}
