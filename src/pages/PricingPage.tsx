import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, TrendingUp, Play, Award, BarChart3, Search, ArrowRight, Check, Loader2, Zap, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSEO } from '../hooks/useSEO';
import { STRIPE_PRODUCTS } from '../stripe-config';
import { supabase } from '../lib/supabase';

const benefits = [
  {
    icon: TrendingUp,
    title: 'Priority Positioning',
    description: 'Your tool appears first in every listing, category page, and related tools section.',
    color: 'text-brand-400',
    bg: 'bg-brand-500/10',
    border: 'border-brand-500/20',
  },
  {
    icon: Star,
    title: 'Featured Section',
    description: 'Get featured on the homepage and category pages where thousands of users discover new tools.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    icon: Play,
    title: 'Demo Video',
    description: 'Add a video demonstration to your tool page so users can see your product in action.',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
  },
  {
    icon: Award,
    title: 'Boosted Badge',
    description: 'A distinctive badge on your tool card signals quality and grabs attention instantly.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
  },
  {
    icon: Search,
    title: 'Search Ranking',
    description: 'Boosted tools rank higher in search results, making your tool easier to find.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    icon: BarChart3,
    title: 'Performance Analytics',
    description: 'Track views, clicks, and engagement metrics to understand how your tool performs.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
  },
];

const faqs = [
  {
    q: 'What does "Boost" do for my tool?',
    a: 'Boost gives your tool premium positioning across the entire platform: higher ranking in listings, a spot in the Featured section, a distinctive badge, and the ability to add a demo video.',
  },
  {
    q: 'Do I need to own the tool to boost it?',
    a: 'Yes. You must be the verified owner of the tool to subscribe to the Boost plan. If you haven\'t claimed your tool yet, you can do so from the tool\'s detail page.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Absolutely. You can cancel your subscription at any time. Your boost benefits will remain active until the end of the current billing period.',
  },
  {
    q: 'What happens when my boost expires?',
    a: 'Your tool returns to standard positioning in listings. The demo video is removed from the public page, and the boosted badge is no longer shown.',
  },
];

export function PricingPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const product = STRIPE_PRODUCTS[0];

  useSEO({
    title: 'Boost Your Tool',
    description: 'Give your tool maximum visibility on ToolsNoCode. Priority positioning, featured placement, demo videos, and more.',
    url: '/pricing',
  });

  const handleSubscribe = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

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
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-500/5 rounded-full blur-[120px]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6">
            <Rocket className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-sm text-brand-400 font-medium">For tool makers & founders</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
            Boost Your Tool's{' '}
            <span className="text-gradient">Visibility</span>
          </h1>

          <p className="text-lg text-surface-400 leading-relaxed max-w-2xl mx-auto">
            Stand out from the crowd. Boosted tools get priority positioning in all listings,
            appear in the featured section, and can showcase a demo video.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
            {benefits.map((b) => (
              <div key={b.title} className="glass-card p-5 group hover:border-surface-700/60 transition-all duration-300">
                <div className={`w-10 h-10 rounded-xl ${b.bg} border ${b.border} flex items-center justify-center mb-4`}>
                  <b.icon className={`w-5 h-5 ${b.color}`} />
                </div>
                <h3 className="text-sm font-semibold text-surface-200 mb-1.5">{b.title}</h3>
                <p className="text-sm text-surface-500 leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 lg:sticky lg:top-24">
            <div className="glass-card overflow-hidden">
              <div className="bg-gradient-to-r from-brand-500/10 to-emerald-500/10 border-b border-surface-800/50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-brand-400" />
                    <span className="font-semibold text-white">{product.name}</span>
                  </div>
                  {product.highlight && (
                    <span className="badge-green text-xs">{product.highlight}</span>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{formatPrice(product.price)}</span>
                    <span className="text-surface-500">/year</span>
                  </div>
                  <p className="text-sm text-surface-500 mt-2">{product.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-brand-500/15 border border-brand-500/25 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-brand-400" />
                      </div>
                      <span className="text-sm text-surface-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {user ? (
                  <button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="w-full btn-primary py-3 text-base"
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
                ) : (
                  <Link to="/signup" className="w-full btn-primary py-3 text-base">
                    Sign Up to Boost
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}

                <p className="text-xs text-surface-600 text-center mt-4">
                  Cancel anytime. No long-term commitment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="glass-card p-6">
              <h3 className="text-sm font-semibold text-surface-200 mb-2">{faq.q}</h3>
              <p className="text-sm text-surface-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
