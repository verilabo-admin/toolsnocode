import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Heart, Wrench, Users, BookOpen, FolderOpen, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import { useSEO } from '../hooks/useSEO';
import type { Tool, Expert, Tutorial, Project } from '../types';
import ToolCard from '../components/ui/ToolCard';
import ExpertCard from '../components/ui/ExpertCard';
import TutorialCard from '../components/ui/TutorialCard';
import ProjectCard from '../components/ui/ProjectCard';

type TabType = 'tools' | 'experts' | 'tutorials' | 'projects';

const tabs: { key: TabType; label: string; icon: typeof Wrench }[] = [
  { key: 'tools', label: 'Tools', icon: Wrench },
  { key: 'experts', label: 'Experts', icon: Users },
  { key: 'tutorials', label: 'Tutorials', icon: BookOpen },
  { key: 'projects', label: 'Projects', icon: FolderOpen },
];

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const { favorites, loading: favsLoading } = useFavorites();
  const [activeTab, setActiveTab] = useState<TabType>('tools');

  useSEO({
    title: 'My Favorites',
    description: 'Your saved tools, experts, tutorials, and projects on ToolsNoCode.',
    url: '/favorites',
    noindex: true,
  });

  const [toolItems, setToolItems] = useState<Tool[]>([]);
  const [expertItems, setExpertItems] = useState<Expert[]>([]);
  const [tutorialItems, setTutorialItems] = useState<Tutorial[]>([]);
  const [projectItems, setProjectItems] = useState<Project[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  useEffect(() => {
    if (favsLoading || favorites.length === 0) {
      setToolItems([]);
      setExpertItems([]);
      setTutorialItems([]);
      setProjectItems([]);
      return;
    }

    const fetchItems = async () => {
      setItemsLoading(true);

      const toolIds = favorites.filter((f) => f.item_type === 'tools').map((f) => f.item_id);
      const expertIds = favorites.filter((f) => f.item_type === 'experts').map((f) => f.item_id);
      const tutorialIds = favorites.filter((f) => f.item_type === 'tutorials').map((f) => f.item_id);
      const projectIds = favorites.filter((f) => f.item_type === 'projects').map((f) => f.item_id);

      const [toolsRes, expertsRes, tutorialsRes, projectsRes] = await Promise.all([
        toolIds.length > 0
          ? supabase.from('tools').select('*, categories(*)').in('id', toolIds)
          : Promise.resolve({ data: [] }),
        expertIds.length > 0
          ? supabase.from('experts').select('*').in('id', expertIds)
          : Promise.resolve({ data: [] }),
        tutorialIds.length > 0
          ? supabase.from('tutorials').select('*, tools(*)').in('id', tutorialIds)
          : Promise.resolve({ data: [] }),
        projectIds.length > 0
          ? supabase.from('projects').select('*, project_tools(tool_id, tools(*))').in('id', projectIds)
          : Promise.resolve({ data: [] }),
      ]);

      setToolItems(
        (toolsRes.data ?? []).map((t: Record<string, unknown>) => ({
          ...t,
          category: t.categories,
        })) as Tool[]
      );
      setExpertItems((expertsRes.data ?? []) as Expert[]);
      setTutorialItems(
        (tutorialsRes.data ?? []).map((t: Record<string, unknown>) => ({
          ...t,
          tool: t.tools,
        })) as Tutorial[]
      );
      setProjectItems(
        (projectsRes.data ?? []).map((p: Record<string, unknown>) => ({
          ...p,
          tools: ((p.project_tools as { tools: Tool }[]) ?? []).map((pt) => pt.tools),
        })) as Project[]
      );

      setItemsLoading(false);
    };

    fetchItems();
  }, [favorites, favsLoading]);

  if (authLoading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  const counts: Record<TabType, number> = {
    tools: toolItems.length,
    experts: expertItems.length,
    tutorials: tutorialItems.length,
    projects: projectItems.length,
  };

  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-rose-500/15 rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-rose-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">My Favorites</h1>
        </div>
        <p className="text-surface-400">
          {totalCount === 0
            ? 'You haven\'t saved any favorites yet'
            : `${totalCount} item${totalCount !== 1 ? 's' : ''} saved`}
        </p>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-500/15 text-brand-400 border border-brand-500/25'
                  : 'bg-surface-900/60 text-surface-400 border border-surface-800/50 hover:text-surface-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {counts[tab.key] > 0 && (
                <span className={`ml-1 px-1.5 py-0.5 rounded-md text-xs ${
                  isActive ? 'bg-brand-500/20 text-brand-300' : 'bg-surface-800 text-surface-500'
                }`}>
                  {counts[tab.key]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {favsLoading || itemsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card p-5 animate-pulse">
              <div className="h-32 bg-surface-800 rounded-xl mb-4" />
              <div className="h-4 bg-surface-800 rounded w-2/3 mb-2" />
              <div className="h-3 bg-surface-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {activeTab === 'tools' && (
            toolItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {toolItems.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
              </div>
            ) : <EmptyState type="tools" href="/tools" />
          )}
          {activeTab === 'experts' && (
            expertItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {expertItems.map((expert) => <ExpertCard key={expert.id} expert={expert} />)}
              </div>
            ) : <EmptyState type="experts" href="/experts" />
          )}
          {activeTab === 'tutorials' && (
            tutorialItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {tutorialItems.map((tutorial) => <TutorialCard key={tutorial.id} tutorial={tutorial} />)}
              </div>
            ) : <EmptyState type="tutorials" href="/tutorials" />
          )}
          {activeTab === 'projects' && (
            projectItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {projectItems.map((project) => <ProjectCard key={project.id} project={project} />)}
              </div>
            ) : <EmptyState type="projects" href="/projects" />
          )}
        </>
      )}
    </div>
  );
}

function EmptyState({ type, href }: { type: string; href: string }) {
  return (
    <div className="glass-card p-12 text-center">
      <Heart className="w-12 h-12 text-surface-700 mx-auto mb-4" />
      <p className="text-surface-400 mb-4">
        No {type} in your favorites yet
      </p>
      <Link to={href} className="btn-primary text-sm inline-flex">
        Explore {type}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
