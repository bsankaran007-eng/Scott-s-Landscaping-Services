export type ServiceTierId = 'essential' | 'full_estate' | 'premier';
export type FrequencyId = 'weekly' | 'biweekly' | 'onetime';
export type AddonId =
  | 'aeration'
  | 'edging'
  | 'leaf_cleanup'
  | 'pine_straw'
  | 'shrub_sculpting'
  | 'fertilization';

export interface ServiceTierMeta {
  id: ServiceTierId;
  name: string;
  tagline: string;
  baseRate: number; // Base fee for up to 0.25 ac
  perQuarterAcreRate: number; // Incremental fee per additional 0.25 ac
  popular?: boolean;
  includes: string[];
}

export interface AddonMeta {
  id: AddonId;
  label: string;
  description: string;
  basePrice: number;
  scalesWithLot: boolean;
}

export interface QuoteConfig {
  acres: number;
  tier: ServiceTierId;
  frequency: FrequencyId;
  addons: AddonId[];
}

export interface QuoteLineItem {
  id: string;
  label: string;
  amount: number;
}

export interface QuoteBreakdown {
  acres: number;
  tierBaseAmount: number;
  addonLineItems: QuoteLineItem[];
  addonsSubtotal: number;
  subtotalBeforeDiscount: number;
  discountRate: number;
  discountAmount: number;
  perVisitTotal: number;
  monthlyEstimate: number | null; // null for one-time restoration
  annualSavings: number;
}

export interface QuoteContactForm {
  fullName: string;
  streetAddress: string;
  neighborhood: string;
  phone: string;
  email: string;
  preferredDate: string;
  hasGateAccess: boolean;
  hasPetsOnProperty: boolean;
  notes: string;
}

export type ValidationErrors = Partial<Record<keyof QuoteContactForm, string>>;

export interface SavedEstimate {
  id: string;
  confirmationCode: string;
  createdAt: string;
  status: 'Scheduled' | 'Cancelled';
  config: QuoteConfig;
  breakdown: QuoteBreakdown;
  contact: QuoteContactForm;
}

export const SERVICE_TIERS: Record<ServiceTierId, ServiceTierMeta> = {
  essential: {
    id: 'essential',
    name: 'Essential Turf Care',
    tagline: 'Precision mowing, string trimming, and hard-surface blowing.',
    baseRate: 68,
    perQuarterAcreRate: 24,
    includes: [
      'Commercial reel or rotary stripe mowing',
      'Curb, driveway & walkway precision edging',
      'Complete hardscape debris blow-off',
    ],
  },
  full_estate: {
    id: 'full_estate',
    name: 'Full Estate Maintenance',
    tagline: 'Complete turf, garden bed weed control, and seasonal detailing.',
    baseRate: 112,
    perQuarterAcreRate: 36,
    popular: true,
    includes: [
      'Everything in Essential Turf Care',
      'Hand-weeding & bed edge blade definition',
      'Selective ornamental pruning & sucker removal',
      'Turf health inspection & gate latch check',
    ],
  },
  premier: {
    id: 'premier',
    name: 'Premier Architectural Grounds',
    tagline: 'White-glove agronomy, year-round turf treatments & dedicated crew lead.',
    baseRate: 175,
    perQuarterAcreRate: 52,
    includes: [
      'Everything in Full Estate Maintenance',
      '7-step North Alabama fertilization & pre-emergent',
      'Dedicated master horticulturist site walks',
      'Priority storm cleanup & seasonal color rotation',
    ],
  },
};

export const ADDON_OPTIONS: AddonMeta[] = [
  {
    id: 'aeration',
    label: 'Core Aeration',
    description: 'Deep mechanical plug aeration for compacted Alabama red clay.',
    basePrice: 85,
    scalesWithLot: true,
  },
  {
    id: 'edging',
    label: 'Bed Trench Edging',
    description: 'Deep hand-spaded Victorian edge around all island and border beds.',
    basePrice: 55,
    scalesWithLot: true,
  },
  {
    id: 'leaf_cleanup',
    label: 'Leaf Cleanup',
    description: 'Full canopy leaf removal and haul-away from turf and beds.',
    basePrice: 95,
    scalesWithLot: true,
  },
  {
    id: 'pine_straw',
    label: 'Pine Straw Refresh',
    description: 'Fresh longleaf golden pine straw hand-tucked to 3-inch depth.',
    basePrice: 140,
    scalesWithLot: true,
  },
  {
    id: 'shrub_sculpting',
    label: 'Shrub Sculpting',
    description: 'Architectural boxwood, holly, and ornamental hedge shaping.',
    basePrice: 75,
    scalesWithLot: false,
  },
  {
    id: 'fertilization',
    label: 'Weed & Fertilization',
    description: 'Soil-balanced slow-release turf nutrition and broadleaf control.',
    basePrice: 65,
    scalesWithLot: true,
  },
];

export const FREQUENCY_CONFIG: Record<
  FrequencyId,
  { label: string; shortLabel: string; discountRate: number; visitsPerMonth: number | null }
> = {
  weekly: {
    label: 'Weekly Estate Plan',
    shortLabel: 'Weekly',
    discountRate: 0.12,
    visitsPerMonth: 4,
  },
  biweekly: {
    label: 'Bi-Weekly Care',
    shortLabel: 'Bi-Weekly',
    discountRate: 0.06,
    visitsPerMonth: 2,
  },
  onetime: {
    label: 'One-Time Restoration',
    shortLabel: 'One-Time',
    discountRate: 0,
    visitsPerMonth: null,
  },
};

export function clampAcres(acres: number): number {
  if (!Number.isFinite(acres)) return 0.5;
  return Math.min(3.5, Math.max(0.15, Math.round(acres * 100) / 100));
}

export function calculateQuote(config: QuoteConfig): QuoteBreakdown {
  const safeAcres = clampAcres(config.acres);
  const tierMeta = SERVICE_TIERS[config.tier];
  const freqMeta = FREQUENCY_CONFIG[config.frequency];

  // Quarter-acre increments above the initial 0.25 ac base
  const extraQuarterAcres = Math.max(0, (safeAcres - 0.25) / 0.25);
  const tierBaseAmount = Math.round(
    tierMeta.baseRate + extraQuarterAcres * tierMeta.perQuarterAcreRate
  );

  // Add-ons scale smoothly with acreage when applicable
  const lotScaleMultiplier = 1 + Math.max(0, safeAcres - 0.25) * 0.45;
  const uniqueAddons = Array.from(new Set(config.addons));

  const addonLineItems: QuoteLineItem[] = uniqueAddons
    .map((addonId): QuoteLineItem | null => {
      const meta = ADDON_OPTIONS.find((item) => item.id === addonId);
      if (!meta) return null;
      const amount = meta.scalesWithLot
        ? Math.round(meta.basePrice * lotScaleMultiplier)
        : meta.basePrice;
      return {
        id: meta.id,
        label: meta.label,
        amount,
      };
    })
    .filter((item): item is QuoteLineItem => item !== null);

  const addonsSubtotal = addonLineItems.reduce((sum, item) => sum + item.amount, 0);
  const subtotalBeforeDiscount = tierBaseAmount + addonsSubtotal;
  const discountAmount = Math.round(subtotalBeforeDiscount * freqMeta.discountRate);
  const perVisitTotal = subtotalBeforeDiscount - discountAmount;

  const monthlyEstimate =
    freqMeta.visitsPerMonth !== null ? perVisitTotal * freqMeta.visitsPerMonth : null;

  // Annual savings estimated across a 36-week North Alabama growing season (March–November)
  const annualVisits =
    config.frequency === 'weekly' ? 36 : config.frequency === 'biweekly' ? 18 : 0;
  const annualSavings = discountAmount * annualVisits;

  return {
    acres: safeAcres,
    tierBaseAmount,
    addonLineItems,
    addonsSubtotal,
    subtotalBeforeDiscount,
    discountRate: freqMeta.discountRate,
    discountAmount,
    perVisitTotal,
    monthlyEstimate,
    annualSavings,
  };
}

export function formatPhoneNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function validateContactForm(form: QuoteContactForm): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!form.fullName.trim() || form.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name.';
  }

  if (!form.streetAddress.trim() || form.streetAddress.trim().length < 5) {
    errors.streetAddress = 'Please enter your property street address.';
  }

  if (!form.neighborhood.trim()) {
    errors.neighborhood = 'Please select your North Alabama service area.';
  }

  const phoneDigits = form.phone.replace(/\D/g, '');
  if (phoneDigits.length !== 10) {
    errors.phone = 'Enter a valid 10-digit telephone number.';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailPattern.test(form.email.trim())) {
    errors.email = 'Enter a valid email address for your written estimate.';
  }

  if (!form.preferredDate.trim()) {
    errors.preferredDate = 'Select a preferred date for your property walk.';
  }

  return errors;
}

export function generateConfirmationCode(seed = Date.now()): string {
  const numericPart = String(Math.abs(seed) % 9000 + 1000);
  return `EC-256-${numericPart}`;
}

export function clampComparisonPercent(value: number): number {
  if (!Number.isFinite(value)) return 50;
  return Math.min(95, Math.max(5, Math.round(value)));
}

export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}
