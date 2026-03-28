import { supabase } from './supabase';

export async function createCheckoutSession(priceId: string, mode: 'subscription' | 'payment', toolId?: string) {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    throw new Error('User not authenticated');
  }

  const body: Record<string, string> = {
    price_id: priceId,
    mode,
    success_url: `${window.location.origin}/success`,
    cancel_url: `${window.location.origin}/pricing`,
  };

  if (toolId) {
    body.tool_id = toolId;
  }

  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Checkout failed (${response.status})`);
  }

  return response.json();
}

export async function getUserSubscription() {
  const { data, error } = await supabase
    .from('stripe_user_subscriptions')
    .select('*')
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}