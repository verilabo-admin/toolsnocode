import { useState, useEffect } from 'react';
import { Newspaper, Search, SlidersHorizontal } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSEO } from '../hooks/useSEO';
import NewsCard from '../components/ui/NewsCard';
import type { NewsArticle } from '../types';

const CATEGORIES = ['All', 'AI Models', 'No-Code Tools', 'Industry', 'Research', 'Policy'];

export default function NewsPage() {
  useSEO({
    title: 'AI & No-Code News | ToolsNoCode',
    description: 'Stay up to date with the latest AI model releases, no-code tool updates, industry moves and research from the world of artificial intelligence.',
  });

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [featured, setFeatured] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const { data: featuredData } = await supabase
        .from('news')
        .select('*')
        .eq('is_featured', true)
        .order('published_at', { ascending: false })
        .limit(3);

      setFeatured(featuredData ?? []);

      const { data } = await supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false });

      setArticles(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = articles.filter((a) => {
    const matchesCategory = activeCategory === 'All' || a.category === activeCategory;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.source.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const featuredIds = new Set(featured.map((f) => f.id));
  const rest = filtered.filter((a) => !featuredIds.has(a.id));

  return (
    <div className="min-h-screen bg-surface-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <Newspaper className="w-5 h-5 text-brand-400" />
            </div>
            <h1 className="text-3xl font-bold text-surface-50">AI & No-Code News</h1>
          </div>
          <p className="text-surface-400 text-base">
            The latest from the world of artificial intelligence and no-code tools — curated weekly.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {featured.length > 0 && activeCategory === 'All' && !search && (
              <section className="mb-12">
                <h2 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-4">Featured</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {featured.map((article) => (
                    <NewsCard key={article.id} article={article} featured />
                  ))}
                </div>
              </section>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search news..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface-900 border border-surface-700/60 text-surface-200 placeholder-surface-500 text-sm focus:outline-none focus:border-brand-500/50 transition-colors"
                />
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                <SlidersHorizontal className="w-4 h-4 text-surface-500 shrink-0" />
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                      activeCategory === cat
                        ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                        : 'text-surface-400 hover:text-surface-200 border border-transparent hover:border-surface-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {rest.length > 0 ? (
              <div className="space-y-3">
                {rest.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <Newspaper className="w-10 h-10 text-surface-600 mx-auto mb-3" />
                <p className="text-surface-400 text-sm">No articles match your search.</p>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
