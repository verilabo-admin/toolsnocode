import React from 'react';
import { Crown, AlertTriangle, XCircle } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';

export function SubscriptionStatus() {
  const { subscription, loading, isActive, isPastDue, isCanceled } = useSubscription();

  if (loading || !subscription) {
    return null;
  }

  const getStatusIcon = () => {
    if (isActive) return <Crown className="h-4 w-4 text-yellow-500" />;
    if (isPastDue) return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    if (isCanceled) return <XCircle className="h-4 w-4 text-red-500" />;
    return null;
  };

  const getStatusText = () => {
    if (isActive) return subscription.productName || 'Active Subscription';
    if (isPastDue) return 'Payment Past Due';
    if (isCanceled) return 'Subscription Canceled';
    return 'Subscription';
  };

  const getStatusColor = () => {
    if (isActive) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (isPastDue) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (isCanceled) return 'text-red-600 bg-red-50 border-red-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor()}`}>
      {getStatusIcon()}
      <span className="ml-2">{getStatusText()}</span>
    </div>
  );
}