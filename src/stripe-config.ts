export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  mode: 'subscription' | 'payment';
}

export const STRIPE_PRODUCTS: StripeProduct[] = [
  {
    id: 'prod_QikFP1nZmEMqOs',
    priceId: 'price_1PrIksIs6L3hD9y66zoxwAX9',
    name: 'Toolsnocode Subscription Basic',
    description: 'Unlock the potential of your tool with the Vale Toolsnocode Subscription Basic plan.',
    price: 49.90,
    currency: 'usd',
    mode: 'subscription'
  }
];

export const getProductById = (id: string): StripeProduct | undefined => {
  return STRIPE_PRODUCTS.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return STRIPE_PRODUCTS.find(product => product.priceId === priceId);
};