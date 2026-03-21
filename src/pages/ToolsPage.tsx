import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, X, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Tool, Category } from '../types';
import ToolCard from '../components/ui/ToolCard';
import SearchBar from '../components/ui/SearchBar';

const pricingOptions = ['all', 'free', 'freemium', 'paid', 'enterprise'] as const;
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'trending', label: 'Trending' },
  { value: 'upvotes', label: 'Most Upvoted' },
  { value: 'featured', label: 'Featured' },
] as const;

export default function ToolsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();

  const search = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || 'all';
  const pricingFilter = searchParams.get('pricing') || 'all';
  const sortBy = searchParams.get('sort') || 'newest';

  useEffect(() => {
    supabase.from('categories').select('*').is('parent_id', null).order('sort_order').then(({ data }) => {
      if (data) setCategories(data);
    });
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      let query = supabase.from('tools').select('*, category:categories(*)');

      if (pricingFilter !== 'all') {
        query = query.eq('pricing', pricingFilter);
      }

      if (sortBy === 'trending') {
        query = query.eq('is_trending', true).order('upvotes', { ascending: false });
      } else if (sortBy === 'featured') {
        query = query.eq('is_featured', true).order('created_at', { ascending: false });
      } else if (sortBy === 'rating') {
        query = query.order('rating', { ascending: false });
      } else if (sortBy === 'upvotes') {
        query = query.order('upvotes', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      query = query.limit(100);
      const { data } = await query;
      setTools(data || []);
      setLoading(false);
    }
    load();
  }, [pricingFilter, sortBy]);

  const filteredTools = useMemo(() => {
    let result = tools;

    if (categoryFilter !== 'all') {
      const matchingCat = categories.find((c) => c.slug === categoryFilter);
      if (matchingCat) {
        result = result.filter((t) => t.category_id === matchingCat.id);
      }
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.tagline.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return result;
  }, [tools, categoryFilter, search, categories]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    if (value === 'all' || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    setSearchParams(params);
  }

  const activeFilterCount = [
    categoryFilter !== 'all' ? 1 : 0,
    pricingFilter !== 'all' ? 1 : 0,
    sortBy !== 'newest' ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tools Directory</h1>
          <p className="text-surface-400">
            Discover and compare the best AI and no-code tools for your projects.
          </p>
        </div>
        {user && (
          <Link to="/tools/new" className="btn-primary text-sm shrink-0">
            <Plus className="w-4 h-4" />
            Add Tool
          </Link>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchBar
          value={search}
          onChange={(v) => updateParam('q', v)}
          placeholder="Search tools..."
          className="flex-1"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary text-sm relative ${showFilters ? 'border-brand-500/50 text-brand-400' : ''}`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="glass-card p-5 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-surface-200">Filters</h3>
            <button
              onClick={() => {
                setSearchParams({});
                setShowFilters(false);
              }}
              className="text-xs text-surface-500 hover:text-surface-300 flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" /> Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => updateParam('category', e.target.value)}
                className="input-field text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-surface-400 mb-2">Pricing</label>
              <select
                value={pricingFilter}
                onChange={(e) => updateParam('pricing', e.target.value)}
                className="input-field text-sm"
              >
                {pricingOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt === 'all' ? 'All Pricing' : opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-surface-400 mb-2">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="input-field text-sm"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-5 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-800" />
                <div className="flex-1">
                  <div className="h-4 bg-surface-800 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-surface-800 rounded w-full mb-1" />
                  <div className="h-3 bg-surface-800 rounded w-4/5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredTools.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-surface-400 text-lg mb-2">No tools found</p>
          <p className="text-surface-500 text-sm mb-6">Try adjusting your search or filters.</p>
          {user && (
            <Link to="/tools/new" className="btn-primary text-sm inline-flex">
              <Plus className="w-4 h-4" />
              Add the first tool
            </Link>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-surface-500 mb-4">
            {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} found
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
