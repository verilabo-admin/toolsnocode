import { supabase } from './supabase';

export async function createCheckoutSession(priceId: string, mode: 'subscription' | 'payment', toolId?: string) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
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

  const { data, error } = await supabase.functions.invoke('stripe-checkout', {
    body,
  });

  if (error) {
    throw new Error(error.message || 'Checkout failed');
  }

  return data;
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