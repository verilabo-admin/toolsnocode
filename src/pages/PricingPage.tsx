import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Rocket, TrendingUp, Play, Award, BarChart3, Search,
  ArrowRight, Check, Loader2, Zap, Star, ChevronDown,
  Eye, MousePointerClick, Trophy, Shield, Clock, Users
} from 'lucide-react';
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
    a: "Yes. You must be the verified owner of the tool to subscribe to the Boost plan. If you haven't claimed your tool yet, you can do so from the tool's detail page.",
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Absolutely. You can cancel your subscription at any time. Your boost benefits will remain active until the end of the current billing period.',
  },
  {
    q: 'What happens when my boost expires?',
    a: 'Your tool returns to standard positioning in listings. The demo video is removed from the public page, and the boosted badge is no longer shown.',
  },
  {
    q: 'How quickly does the boost take effect?',
    a: 'Your tool is boosted immediately after payment. Priority positioning, the featured badge, and elevated search ranking are all applied within minutes.',
  },
];

const comparison = [
  { feature: 'Position in listings', standard: 'Random / bottom', boosted: 'Always first' },
  { feature: 'Featured section', standard: false, boosted: true },
  { feature: 'Demo video', standard: false, boosted: true },
  { feature: 'Boosted badge', standard: false, boosted: true },
  { feature: 'Search ranking', standard: 'Standard', boosted: 'Priority' },
  { feature: 'Analytics dashboard', standard: false, boosted: true },
];

export function PricingPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-500/8 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-brand-500/6 rounded-full blur-[140px]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6">
            <Rocket className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-sm text-brand-400 font-medium">For tool makers & founders</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
            Get Found by{' '}
            <span className="text-gradient">Thousands</span>{' '}
            of Builders
          </h1>

          <p className="text-lg text-surface-400 leading-relaxed max-w-2xl mx-auto mb-8">
            Boosted tools get <strong className="text-surface-200">5x more clicks</strong>, appear first in every listing, and land in the Featured section seen by every visitor.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center gap-2 text-sm text-surface-400">
              <Eye className="w-4 h-4 text-brand-400" />
              <span><strong className="text-surface-200">Priority</strong> visibility</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-surface-400">
              <MousePointerClick className="w-4 h-4 text-emerald-400" />
              <span><strong className="text-surface-200">5x</strong> more clicks</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-surface-400">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span><strong className="text-surface-200">Featured</strong> on homepage</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-surface-400">
              <Shield className="w-4 h-4 text-sky-400" />
              <span><strong className="text-surface-200">Cancel</strong> anytime</span>
            </div>
          </div>

          {user ? (
            <button onClick={handleSubscribe} disabled={loading} className="btn-primary text-base px-8 py-3.5">
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
              ) : (
                <><Rocket className="w-5 h-5" /> Boost My Tool Now — {formatPrice(product.price)}/yr</>
              )}
            </button>
          ) : (
            <Link to="/signup" className="btn-primary text-base px-8 py-3.5">
              <Rocket className="w-5 h-5" />
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          <p className="text-xs text-surface-600 mt-3">No contracts. Cancel anytime.</p>
        </div>
      </section>

      {/* Comparison table */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-xl font-bold text-white text-center mb-6">Standard vs Boosted</h2>
        <div className="glass-card overflow-hidden">
          <div className="grid grid-cols-3 text-xs font-semibold uppercase tracking-wider">
            <div className="px-5 py-3 text-surface-500">Feature</div>
            <div className="px-5 py-3 text-surface-500 text-center border-l border-surface-800/50">Standard</div>
            <div className="px-5 py-3 text-brand-400 text-center border-l border-brand-500/20 bg-brand-500/5">Boosted</div>
          </div>
          {comparison.map((row, i) => (
            <div key={row.feature} className={`grid grid-cols-3 border-t border-surface-800/50 ${i % 2 === 0 ? '' : 'bg-surface-900/30'}`}>
              <div className="px-5 py-3.5 text-sm text-surface-300">{row.feature}</div>
              <div className="px-5 py-3.5 text-sm text-surface-500 text-center border-l border-surface-800/50">
                {typeof row.standard === 'boolean' ? (
                  row.standard ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-surface-700">—</span>
                ) : row.standard}
              </div>
              <div className="px-5 py-3.5 text-sm text-center border-l border-brand-500/20 bg-brand-500/5">
                {typeof row.boosted === 'boolean' ? (
                  row.boosted ? <Check className="w-4 h-4 text-brand-400 mx-auto" /> : <span className="text-surface-700">—</span>
                ) : <span className="text-brand-400 font-medium">{row.boosted}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits + Pricing card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
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
            <div className="glass-card overflow-hidden ring-1 ring-brand-500/20">
              <div className="bg-gradient-to-r from-brand-500/15 to-emerald-500/10 border-b border-surface-800/50 px-6 py-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-brand-400" />
                    <span className="font-semibold text-white">{product.name}</span>
                  </div>
                  {product.highlight && (
                    <span className="badge-green text-xs">{product.highlight}</span>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{formatPrice(product.price)}</span>
                  <span className="text-surface-400">/year</span>
                </div>
                <p className="text-xs text-surface-500 mt-1.5">
                  That's {formatPrice(product.price / 12)}/month — less than a coffee per week
                </p>
              </div>

              <div className="p-6">
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

                {user ? (
                  <button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="w-full btn-primary py-3.5 text-base"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                    ) : (
                      <><Rocket className="w-4 h-4" /> Boost My Tool</>
                    )}
                  </button>
                ) : (
                  <Link to="/signup" className="w-full btn-primary py-3.5 text-base">
                    Sign Up to Boost
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-surface-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Boost activates instantly after payment</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-surface-500">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Cancel anytime. No questions asked.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="mt-4 glass-card p-5 border-surface-800/60">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-200 mb-1">Don't have a listing yet?</p>
                  <p className="text-xs text-surface-500 mb-3 leading-relaxed">
                    Submit your tool for free and reach thousands of AI & no-code builders.
                  </p>
                  <Link to="/tools/new" className="btn-secondary text-xs py-1.5 px-3">
                    Submit your tool free
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mid-page CTA banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-500/10 via-surface-900/60 to-emerald-500/10 border border-brand-500/25 p-8 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-500/8 via-transparent to-transparent" />
          <div className="relative">
            <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-3">Limited spots at this price</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Your competitors are already boosted.
            </h2>
            <p className="text-surface-400 max-w-xl mx-auto mb-6 text-sm leading-relaxed">
              Every day your tool isn't boosted, it's falling behind. Boosted tools appear first — in search, in listings, and on the homepage.
            </p>
            {user ? (
              <button onClick={handleSubscribe} disabled={loading} className="btn-primary px-8 py-3">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Rocket className="w-4 h-4" /> Boost Now — {formatPrice(product.price)}/yr</>}
              </button>
            ) : (
              <Link to="/signup" className="btn-primary px-8 py-3">
                <Rocket className="w-4 h-4" />
                Start for free, boost anytime
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={faq.q} className="glass-card overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
              >
                <span className="text-sm font-semibold text-surface-200">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-surface-500 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 border-t border-surface-800/50 pt-4">
                  <p className="text-sm text-surface-400 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="glass-card p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 via-transparent to-brand-500/5" />
          <div className="relative">
            <Rocket className="w-10 h-10 text-brand-400 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Ready to get more users?
            </h2>
            <p className="text-surface-400 mb-6 max-w-lg mx-auto text-sm leading-relaxed">
              Join the builders already using Boost to get discovered faster. {formatPrice(product.price)}/year. Cancel anytime.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {user ? (
                <button onClick={handleSubscribe} disabled={loading} className="btn-primary px-8 py-3">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Rocket className="w-4 h-4" /> Boost My Tool</>}
                </button>
              ) : (
                <Link to="/signup" className="btn-primary px-8 py-3">
                  <Rocket className="w-4 h-4" />
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              <Link to="/tools" className="btn-secondary px-8 py-3">
                <Search className="w-4 h-4" />
                Browse Tools
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
