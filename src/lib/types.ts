export const packageTiers = ["basic", "pro", "business"] as const;
export type PackageTier = (typeof packageTiers)[number];

export const billingCycles = ["monthly", "yearly"] as const;
export type BillingCycle = (typeof billingCycles)[number];

export type ProductPackage = {
  id: PackageTier;
  name: string;
  price: number;
  promoPrice: number | null;
  highlights: string[];
};

export type ComparisonRow = {
  label: string;
  basic: string;
  pro: string;
  business: string;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  description: string;
  features: string[];
  promoQuota: number;
  packages: ProductPackage[];
  comparison: ComparisonRow[];
};

export type CartLine = {
  lineId: string;
  productSlug: string;
  packageId: PackageTier;
  cycle: BillingCycle;
  licenses: number;
};

export type UtmParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

export type PricedLine = CartLine & {
  name: string;
  packageName: string;
  unit: number;
  amount: number;
};
