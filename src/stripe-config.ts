export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  mode: 'subscription' | 'payment';
  features: string[];
  highlight?: string;
}

export const STRIPE_PRODUCTS: StripeProduct[] = [
  {
    id: 'prod_QikFP1nZmEMqOs',
    priceId: 'price_1PrIksIs6L3hD9y66zoxwAX9',
    name: 'Boost',
    description: 'Give your tool maximum visibility across the entire platform.',
    price: 49.90,
    currency: 'usd',
    mode: 'subscription',
    highlight: 'Best for tool makers',
    features: [
      'Priority positioning in all listings',
      'Featured in the "Featured Tools" section',
      'Add a demo video to your tool page',
      'Highlighted badge on your tool card',
      'Higher ranking in search results',
      'Monthly performance analytics',
    ],
  },
];

export const getProductById = (id: string): StripeProduct | undefined => {
  return STRIPE_PRODUCTS.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return STRIPE_PRODUCTS.find(product => product.priceId === priceId);
};
