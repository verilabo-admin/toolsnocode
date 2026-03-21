import { useState } from 'react';
import { Check, Loader2, Rocket } from 'lucide-react';
import { StripeProduct } from '../../stripe-config';
import { supabase } from '../../lib/supabase';

interface SubscriptionCardProps {
  product: StripeProduct;
}

export function SubscriptionCard({ product }: SubscriptionCardProps) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: product.priceId,
          mode: product.mode,
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/pricing`,
        }),
      });

      if (!response.ok) throw new Error('Failed to create checkout session');

      const { url } = await response.json();
      if (url) window.location.href = url;
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  return (
    <div className="glass-card overflow-hidden">
      <div className="bg-gradient-to-r from-brand-500/10 to-emerald-500/10 border-b border-surface-800/50 px-6 py-4">
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-brand-400" />
          <span className="font-semibold text-white">{product.name}</span>
        </div>
      </div>

      <div className="p-6">
        <p className="text-sm text-surface-500 mb-4">{product.description}</p>

        <div className="mb-6">
          <span className="text-3xl font-bold text-white">{formatPrice(product.price)}</span>
          <span className="text-surface-500 ml-1">/month</span>
        </div>

        <ul className="space-y-3 mb-6">
          {product.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <div className="mt-0.5 w-5 h-5 rounded-full bg-brand-500/15 border border-brand-500/25 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-brand-400" />
              </div>
              <span className="text-sm text-surface-300">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full btn-primary py-3"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Rocket className="w-4 h-4" />
              Boost My Tool
            </>
          )}
        </button>
      </div>
    </div>
  );
}
