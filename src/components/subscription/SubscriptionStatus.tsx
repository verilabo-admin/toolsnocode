import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Subscription {
  subscription_status: string;
  price_id: string;
  current_period_end: number;
  cancel_at_period_end: boolean;
}

export function SubscriptionStatus() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchSubscription = async () => {
      try {
        const { data, error } = await supabase
          .from('stripe_user_subscriptions')
          .select('*')
          .maybeSingle();

        if (!error) setSubscription(data);
      } catch {
        // silently ignore
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  if (loading || !user) return null;

  if (!subscription || subscription.subscription_status !== 'active') {
    return (
      <div className="glass-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-800 border border-surface-700 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-surface-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-surface-300">No active boost</p>
              <p className="text-xs text-surface-600">Boost your tool to get premium visibility</p>
            </div>
          </div>
          <Link to="/pricing" className="btn-primary text-xs py-1.5 px-3">
            Boost
          </Link>
        </div>
      </div>
    );
  }

  const endDate = new Date(subscription.current_period_end * 1000);

  return (
    <div className="glass-card p-4 border-brand-500/20">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
          <Rocket className="w-4 h-4 text-brand-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-brand-400">Boost Active</p>
          <p className="text-xs text-surface-500">
            {subscription.cancel_at_period_end ? 'Expires' : 'Renews'} {endDate.toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
