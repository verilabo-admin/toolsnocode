import React, { useEffect, useState } from 'react';
import { Crown, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../auth/AuthProvider';

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

        if (error) {
          console.error('Error fetching subscription:', error);
        } else {
          setSubscription(data);
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-10 w-10"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!subscription || subscription.subscription_status === 'not_started') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">No Active Subscription</h3>
            <p className="text-sm text-yellow-700">Subscribe to unlock premium features</p>
          </div>
        </div>
      </div>
    );
  }

  const isActive = subscription.subscription_status === 'active';
  const endDate = new Date(subscription.current_period_end * 1000);

  return (
    <div className={`rounded-lg p-4 ${isActive ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
      <div className="flex items-center">
        <Crown className={`h-5 w-5 mr-3 ${isActive ? 'text-green-600' : 'text-red-600'}`} />
        <div>
          <h3 className={`text-sm font-medium ${isActive ? 'text-green-800' : 'text-red-800'}`}>
            {isActive ? 'Toolsnocode Subscription Basic' : 'Subscription Inactive'}
          </h3>
          <p className={`text-sm ${isActive ? 'text-green-700' : 'text-red-700'}`}>
            {isActive 
              ? `${subscription.cancel_at_period_end ? 'Expires' : 'Renews'} on ${endDate.toLocaleDateString()}`
              : 'Your subscription is not active'
            }
          </p>
        </div>
      </div>
    </div>
  );
}