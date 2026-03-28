import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Calendar, Tag } from 'lucide-react';
import type { NewsArticle } from '../../types';

const categoryColors: Record<string, string> = {
  'AI Models': 'bg-sky-500/15 text-sky-400 border-sky-500/20',
  'No-Code Tools': 'bg-brand-500/15 text-brand-400 border-brand-500/20',
  'Industry': 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  'Research': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  'Policy': 'bg-rose-500/15 text-rose-400 border-rose-500/20',
};

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

export default memo(function NewsCard({ article, featured = false }: NewsCardProps) {
  const colorClass = categoryColors[article.category] ?? 'bg-surface-700/50 text-surface-300 border-surface-600/30';

  const formattedDate = new Date(article.published_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (featured) {
    return (
      <Link
        to={`/news/${article.slug}`}
        className="group block rounded-2xl bg-surface-900 border border-surface-700/50 hover:border-surface-600/80 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5"
        aria-label={`Read: ${article.title}`}
      >
        <div className="aspect-[16/7] bg-surface-800 relative overflow-hidden">
          {article.image_url ? (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-800 to-surface-900">
              <div className="w-16 h-16 rounded-2xl bg-surface-700/60 flex items-center justify-center">
                <Tag className="w-7 h-7 text-surface-500" />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-900/80 via-transparent to-transparent" />
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${colorClass}`}>
              {article.category}
            </span>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-surface-500 mb-2.5">
            <span className="font-medium text-surface-400">{article.source}</span>
            <span>·</span>
            <Calendar className="w-3 h-3" />
            <time dateTime={article.published_at}>{formattedDate}</time>
          </div>

          <h3 className="text-base font-semibold text-surface-100 group-hover:text-brand-400 transition-colors leading-snug mb-2">
            {article.title}
          </h3>
          <p className="text-sm text-surface-400 line-clamp-2 leading-relaxed">
            {article.summary}
          </p>

          <div className="flex items-center gap-1.5 mt-4 flex-wrap">
            {article.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-md bg-surface-800 border border-surface-700/50 text-xs text-surface-500">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/news/${article.slug}`}
      className="group flex gap-4 p-4 rounded-xl bg-surface-900 border border-surface-700/50 hover:border-surface-600/80 transition-all duration-200 hover:bg-surface-800/60"
      aria-label={`Read: ${article.title}`}
    >
      {article.image_url && (
        <img
          src={article.image_url}
          alt={article.title}
          className="w-16 h-14 rounded-lg object-cover shrink-0"
          loading="lazy"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${colorClass}`}>
            {article.category}
          </span>
          <span className="text-xs text-surface-500">{article.source}</span>
          <span className="text-xs text-surface-600">·</span>
          <time dateTime={article.published_at} className="text-xs text-surface-600">{formattedDate}</time>
        </div>

        <h3 className="text-sm font-semibold text-surface-200 group-hover:text-brand-400 transition-colors leading-snug mb-1">
          {article.title}
        </h3>
        <p className="text-xs text-surface-500 line-clamp-2 leading-relaxed">
          {article.summary}
        </p>

        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {article.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-1.5 py-0.5 rounded bg-surface-800 border border-surface-700/40 text-[10px] text-surface-500">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="shrink-0 self-start mt-1">
        <ExternalLink className="w-3.5 h-3.5 text-surface-600 group-hover:text-surface-300 transition-colors" />
      </div>
    </Link>
  );
});
