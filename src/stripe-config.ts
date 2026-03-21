export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const stripeProducts: StripeProduct[] = [
  {
    priceId: 'price_1PrIksIs6L3hD9y66zoxwAX9',
    name: 'Toolsnocode Subscription Basic',
    description: 'Unlock the potential of your tool with the Vale Toolsnocode Subscription Basic plan.',
    mode: 'subscription',
  },
];