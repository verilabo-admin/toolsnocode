import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Star, TrendingUp, ShieldCheck, Rocket } from 'lucide-react';
import type { Tool } from '../../types';
import UpvoteButton from './UpvoteButton';

const pricingColors: Record<string, string> = {
  free: 'bg-brand-500/15 text-brand-400 border-brand-500/20',
  freemium: 'bg-sky-500/15 text-sky-400 border-sky-500/20',
  paid: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  enterprise: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
};

interface ToolCardProps {
  tool: Tool;
}

export default memo(function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link
      to={`/tools/${tool.slug}`}
      className={`glass-card-hover p-5 group block ${tool.is_boosted ? 'border-brand-500/25 hover:border-brand-500/40' : ''}`}
    >
      {tool.is_boosted && (
        <div className="flex items-center gap-1.5 mb-3 -mt-0.5">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/20">
            <Rocket className="w-3 h-3 text-brand-400" />
            <span className="text-[10px] font-semibold text-brand-400 uppercase tracking-wide">Boosted</span>
          </div>
        </div>
      )}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-surface-800 border border-surface-700/50 flex items-center justify-center overflow-hidden flex-shrink-0">
          {tool.logo_url ? (
            <img src={tool.logo_url} alt={tool.name} className="w-full h-full object-cover rounded-xl" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          ) : (
            <span className="text-lg font-bold text-surface-400">
              {tool.name.charAt(0)}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-white group-hover:text-brand-400 transition-colors truncate">
              {tool.name}
            </h3>
            {tool.is_trending && (
              <TrendingUp className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            )}
            {tool.is_verified && (
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" aria-label="Verified" />
            )}
            <ArrowUpRight className="w-4 h-4 text-surface-600 group-hover:text-brand-400 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0" />
          </div>

          <p className="text-sm text-surface-400 line-clamp-2 leading-relaxed mb-3">
            {tool.tagline}
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <span className={`badge border ${pricingColors[tool.pricing] || pricingColors.free}`}>
              {tool.pricing}
            </span>

            {tool.rating > 0 && (
              <span className="flex items-center gap-1 text-xs text-surface-400">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                {tool.rating.toFixed(1)}
              </span>
            )}

            <UpvoteButton itemType="tools" itemId={tool.id} initialCount={tool.upvotes} size="sm" />

            {tool.tags.length > 0 && (
              <span className="badge-neutral">{tool.tags[0]}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
});
