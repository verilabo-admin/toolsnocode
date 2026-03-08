import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Project, Tool } from '../types';
import ProjectCard from '../components/ui/ProjectCard';
import SearchBar from '../components/ui/SearchBar';

export default function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState<(Project & { tools: Tool[] })[]>([]);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('q') || '';

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from('projects')
        .select('*, project_tools(tool:tools(*))')
        .order('upvotes', { ascending: false })
        .limit(100);

      if (data) {
        const mapped = data.map((p: any) => ({
          ...p,
          tools: p.project_tools?.map((pt: any) => pt.tool).filter(Boolean) || [],
        }));
        setProjects(mapped);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filteredProjects = useMemo(() => {
    if (!search) return projects;
    const q = search.toLowerCase();
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.author_name.toLowerCase().includes(q)
    );
  }, [projects, search]);

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Project Showcase</h1>
        <p className="text-surface-400">
          Explore amazing projects built with AI and no-code tools.
        </p>
      </div>

      <SearchBar
        value={search}
        onChange={updateSearch}
        placeholder="Search projects..."
        className="max-w-xl mb-8"
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card overflow-hidden animate-pulse">
              <div className="aspect-[16/10] bg-surface-800" />
              <div className="p-5">
                <div className="h-4 bg-surface-800 rounded w-2/3 mb-2" />
                <div className="h-3 bg-surface-800 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-surface-400 text-lg mb-2">No projects found</p>
          <p className="text-surface-500 text-sm">Try adjusting your search.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-surface-500 mb-4">
            {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
