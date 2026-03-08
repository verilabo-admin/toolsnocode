import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Users, BookOpen, Rocket, Search, TrendingUp, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Tool, Category } from '../types';
import ToolCard from '../components/ui/ToolCard';
import CategoryCard from '../components/ui/CategoryCard';

export default function HomePage() {
  const [featuredTools, setFeaturedTools] = useState<Tool[]>([]);
  const [trendingTools, setTrendingTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState({ tools: 0, experts: 0, tutorials: 0, projects: 0 });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function load() {
      const [featuredRes, trendingRes, catRes, toolCount, expertCount, tutorialCount, projectCount] =
        await Promise.all([
          supabase.from('tools').select('*').eq('is_featured', true).limit(6),
          supabase.from('tools').select('*').eq('is_trending', true).order('upvotes', { ascending: false }).limit(6),
          supabase.from('categories').select('*').is('parent_id', null).order('sort_order'),
          supabase.from('tools').select('id', { count: 'exact', head: true }),
          supabase.from('experts').select('id', { count: 'exact', head: true }),
          supabase.from('tutorials').select('id', { count: 'exact', head: true }),
          supabase.from('projects').select('id', { count: 'exact', head: true }),
        ]);

      if (featuredRes.data) setFeaturedTools(featuredRes.data);
      if (trendingRes.data) setTrendingTools(trendingRes.data);
      if (catRes.data) setCategories(catRes.data);
      setStats({
        tools: toolCount.count || 0,
        experts: expertCount.count || 0,
        tutorials: tutorialCount.count || 0,
        projects: projectCount.count || 0,
      });
    }
    load();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/tools?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-500/5 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32 lg:pb-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span className="text-sm text-brand-400 font-medium">The AI Builder Economy starts here</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-slide-up">
              Discover the Best{' '}
              <span className="text-gradient">AI & No-Code</span>{' '}
              Tools
            </h1>

            <p className="text-lg sm:text-xl text-surface-400 leading-relaxed mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
              Find tools, compare stacks, learn from tutorials, connect with experts, and showcase your projects. All in one place.
            </p>

            <form onSubmit={handleSearch} className="relative max-w-xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search AI tools, no-code platforms, automation..."
                className="w-full pl-12 pr-32 py-4 bg-surface-900/80 border border-surface-700/50 rounded-2xl text-surface-100 placeholder-surface-500 focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all text-base"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary text-sm">
                Search
              </button>
            </form>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-surface-500 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand-400" />
                <span><strong className="text-surface-200">{stats.tools}</strong> Tools</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" />
                <span><strong className="text-surface-200">{stats.experts}</strong> Experts</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span><strong className="text-surface-200">{stats.tutorials}</strong> Tutorials</span>
              </div>
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-rose-400" />
                <span><strong className="text-surface-200">{stats.projects}</strong> Projects</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Browse Categories</h2>
            <Link to="/tools" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>
      )}

      {featuredTools.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-brand-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Featured Tools</h2>
            </div>
            <Link to="/tools?sort=featured" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {trendingTools.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Trending Now</h2>
            </div>
            <Link to="/tools?sort=trending" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="glass-card p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 via-transparent to-brand-500/5" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to discover your next stack?
            </h2>
            <p className="text-surface-400 mb-8 max-w-lg mx-auto">
              Explore thousands of AI and no-code tools. Find the perfect combination for your next project.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/tools" className="btn-primary">
                <Search className="w-4 h-4" />
                Explore Tools
              </Link>
              <Link to="/experts" className="btn-secondary">
                <Users className="w-4 h-4" />
                Find Experts
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
