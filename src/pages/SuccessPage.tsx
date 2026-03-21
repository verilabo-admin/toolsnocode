import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Rocket, Play, TrendingUp } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export function SuccessPage() {
  useSEO({
    title: 'Boost Activated',
    description: 'Your tool boost is now active on ToolsNoCode.',
    url: '/success',
    noindex: true,
  });

  useEffect(() => {
    localStorage.removeItem('checkout_session_id');
  }, []);

  const nextSteps = [
    {
      icon: TrendingUp,
      text: 'Your tool now has priority positioning in all listings',
      color: 'text-brand-400',
    },
    {
      icon: Rocket,
      text: 'Your tool will appear in the Featured section',
      color: 'text-amber-400',
    },
    {
      icon: Play,
      text: 'You can now add a demo video to your tool page',
      color: 'text-sky-400',
    },
  ];

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-500/15 border border-brand-500/25 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-brand-400" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">
          Boost Activated!
        </h1>
        <p className="text-surface-400 mb-8">
          Your tool is now boosted and will receive premium visibility across ToolsNoCode.
        </p>

        <div className="glass-card p-6 mb-8 text-left">
          <h2 className="text-sm font-semibold text-surface-200 mb-4">What happens now</h2>
          <ul className="space-y-4">
            {nextSteps.map((step) => (
              <li key={step.text} className="flex items-start gap-3">
                <step.icon className={`w-5 h-5 ${step.color} mt-0.5 flex-shrink-0`} />
                <span className="text-sm text-surface-400">{step.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <Link to="/tools" className="w-full btn-primary py-3 text-base">
            Go to Your Tools
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/account"
            className="w-full btn-secondary py-3 text-base"
          >
            Manage Subscription
          </Link>
        </div>

        <p className="text-xs text-surface-600 mt-6">
          You will receive a confirmation email with your subscription details.
        </p>
      </div>
    </div>
  );
}
