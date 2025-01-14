export interface RawPricingPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  interval: string;
  features: any[];
  is_active: boolean | null;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  features: { feature: string }[];
}

export const transformPricingPlan = (raw: RawPricingPlan): PricingPlan => {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description || "",
    price: raw.price,
    currency: raw.currency,
    interval: raw.interval,
    features: raw.features.map(f => {
      if (typeof f === 'object' && f !== null && 'feature' in f) {
        return { feature: String(f.feature) };
      }
      return { feature: String(f) };
    })
  };
};