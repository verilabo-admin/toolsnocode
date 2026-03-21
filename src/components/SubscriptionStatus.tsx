import { Rocket, AlertTriangle, XCircle } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';

export function SubscriptionStatus() {
  const { subscription, loading, isActive, isPastDue, isCanceled } = useSubscription();

  if (loading || !subscription) return null;

  const getStatusIcon = () => {
    if (isActive) return <Rocket className="w-4 h-4 text-brand-400" />;
    if (isPastDue) return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    if (isCanceled) return <XCircle className="w-4 h-4 text-red-400" />;
    return null;
  };

  const getStatusText = () => {
    if (isActive) return 'Boost Active';
    if (isPastDue) return 'Payment Past Due';
    if (isCanceled) return 'Boost Canceled';
    return 'Boost';
  };

  const getStatusColor = () => {
    if (isActive) return 'text-brand-400 bg-brand-500/10 border-brand-500/20';
    if (isPastDue) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    if (isCanceled) return 'text-red-400 bg-red-500/10 border-red-500/20';
    return 'text-surface-400 bg-surface-800 border-surface-700';
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
      {getStatusIcon()}
      <span>{getStatusText()}</span>
    </div>
  );
}
