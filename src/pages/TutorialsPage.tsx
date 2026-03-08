import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Tutorial } from '../types';
import TutorialCard from '../components/ui/TutorialCard';
import SearchBar from '../components/ui/SearchBar';

const contentTypes = ['all', 'video', 'guide', 'course', 'article'] as const;
const levels = ['all', 'beginner', 'intermediate', 'advanced'] as const;

export default function TutorialsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('q') || '';
  const typeFilter = searchParams.get('type') || 'all';
  const levelFilter = searchParams.get('level') || 'all';

  useEffect(() => {
    async function load() {
      setLoading(true);
      let query = supabase.from('tutorials').select('*, tool:tools(*)').order('created_at', { ascending: false }).limit(100);

      if (typeFilter !== 'all') {
        query = query.eq('content_type', typeFilter);
      }
      if (levelFilter !== 'all') {
        query = query.eq('difficulty_level', levelFilter);
      }

      const { data } = await query;
      if (data) setTutorials(data);
      setLoading(false);
    }
    load();
  }, [typeFilter, levelFilter]);

  const filteredTutorials = useMemo(() => {
    if (!search) return tutorials;
    const q = search.toLowerCase();
    return tutorials.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.author_name.toLowerCase().includes(q)
    );
  }, [tutorials, search]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    if (value === 'all' || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    setSearchParams(params);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Tutorials & Guides</h1>
        <p className="text-surface-400">
          Learn how to use the best AI and no-code tools with step-by-step tutorials.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <SearchBar
          value={search}
          onChange={(v) => updateParam('q', v)}
          placeholder="Search tutorials..."
          className="flex-1"
        />
        <select
          value={typeFilter}
          onChange={(e) => updateParam('type', e.target.value)}
          className="input-field text-sm sm:w-40"
        >
          {contentTypes.map((t) => (
            <option key={t} value={t}>{t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
        <select
          value={levelFilter}
          onChange={(e) => updateParam('level', e.target.value)}
          className="input-field text-sm sm:w-40"
        >
          {levels.map((l) => (
            <option key={l} value={l}>{l === 'all' ? 'All Levels' : l.charAt(0).toUpperCase() + l.slice(1)}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card overflow-hidden animate-pulse">
              <div className="aspect-video bg-surface-800" />
              <div className="p-5">
                <div className="h-3 bg-surface-800 rounded w-1/3 mb-3" />
                <div className="h-4 bg-surface-800 rounded w-2/3 mb-2" />
                <div className="h-3 bg-surface-800 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredTutorials.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-surface-400 text-lg mb-2">No tutorials found</p>
          <p className="text-surface-500 text-sm">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-surface-500 mb-4">
            {filteredTutorials.length} tutorial{filteredTutorials.length !== 1 ? 's' : ''} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTutorials.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
