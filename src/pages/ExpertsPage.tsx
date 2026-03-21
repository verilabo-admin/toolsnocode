import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Expert } from '../types';
import ExpertCard from '../components/ui/ExpertCard';
import SearchBar from '../components/ui/SearchBar';
import { useSEO } from '../hooks/useSEO';

export default function ExpertsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useSEO({
    title: 'No-Code & AI Experts',
    description: 'Find and connect with top no-code and AI experts. Browse expert profiles, tools they use, and hire them for your next project.',
    url: '/experts',
  });

  const search = searchParams.get('q') || '';

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from('experts')
        .select('*')
        .order('rating', { ascending: false })
        .limit(100);

      if (data) setExperts(data);
      setLoading(false);
    }
    load();
  }, []);

  const filteredExperts = useMemo(() => {
    if (!search) return experts;
    const q = search.toLowerCase();
    return experts.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.bio.toLowerCase().includes(q) ||
        e.country.toLowerCase().includes(q)
    );
  }, [experts, search]);

  function updateSearch(value: string) {
    const params = new URLSearchParams(searchParams);
    if (!value) {
      params.delete('q');
    } else {
      params.set('q', value);
    }
    setSearchParams(params);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Find Experts</h1>
          <p className="text-surface-400">
            Connect with top AI and no-code professionals for your projects.
          </p>
        </div>
        {user && (
          <Link to="/experts/new" className="btn-primary text-sm shrink-0">
            <Plus className="w-4 h-4" />
            Add Expert
          </Link>
        )}
      </div>

      <SearchBar
        value={search}
        onChange={updateSearch}
        placeholder="Search experts by name, skill, or country..."
        className="max-w-xl mb-8"
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-surface-800" />
                <div className="flex-1">
                  <div className="h-4 bg-surface-800 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-surface-800 rounded w-2/3 mb-1" />
                  <div className="h-3 bg-surface-800 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredExperts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-surface-400 text-lg mb-2">No experts found</p>
          <p className="text-surface-500 text-sm mb-6">Try adjusting your search.</p>
          {user && (
            <Link to="/experts/new" className="btn-primary text-sm inline-flex">
              <Plus className="w-4 h-4" />
              Add your profile
            </Link>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-surface-500 mb-4">
            {filteredExperts.length} expert{filteredExperts.length !== 1 ? 's' : ''} found
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExperts.map((expert) => (
              <ExpertCard key={expert.id} expert={expert} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
