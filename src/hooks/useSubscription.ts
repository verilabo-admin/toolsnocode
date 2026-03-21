import { useState, useEffect } from 'react';
import { getUserSubscription } from '../lib/stripe';
import { getProductByPriceId } from '../stripe-config';
import { useAuth } from './useAuth';

interface Subscription {
  subscription_status: string;
  price_id: string;
  current_period_end: number;
  cancel_at_period_end: boolean;
  productName?: string;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      try {
        setLoading(true);
        const data = await getUserSubscription();
        
        if (data && data.price_id) {
          const product = getProductByPriceId(data.price_id);
          setSubscription({
            ...data,
            productName: product?.name
          });
        } else {
          setSubscription(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch subscription');
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  const isActive = subscription?.subscription_status === 'active';
  const isPastDue = subscription?.subscription_status === 'past_due';
  const isCanceled = subscription?.subscription_status === 'canceled';

  return {
    subscription,
    loading,
    error,
    isActive,
    isPastDue,
    isCanceled,
    hasSubscription: !!subscription
  };
}