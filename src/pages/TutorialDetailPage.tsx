import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, Video, FileText, GraduationCap, ExternalLink, Pencil } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import FavoriteButton from '../components/ui/FavoriteButton';
import type { Tutorial, Tool } from '../types';

const typeIcons: Record<string, typeof Video> = {
  video: Video,
  guide: BookOpen,
  course: GraduationCap,
  article: FileText,
};

export default function TutorialDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoading(true);

      const { data } = await supabase
        .from('tutorials')
        .select('*, tool:tools(*)')
        .eq('slug', slug)
        .maybeSingle();

      if (data) {
        setTutorial(data);
        if (data.tool) setTool(data.tool);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-surface-800 rounded w-24" />
          <div className="aspect-video bg-surface-800 rounded-2xl" />
          <div className="h-7 bg-surface-800 rounded w-2/3" />
          <div className="h-4 bg-surface-800 rounded w-full" />
        </div>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Tutorial not found</h1>
        <Link to="/tutorials" className="btn-primary">Back to Tutorials</Link>
      </div>
    );
  }

  const Icon = typeIcons[tutorial.content_type] || FileText;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <Link to="/tutorials" className="inline-flex items-center gap-1.5 text-sm text-surface-400 hover:text-surface-200 transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" />
        Back to Tutorials
      </Link>

      {tutorial.video_url && (
        <div className="aspect-video bg-surface-900 rounded-2xl overflow-hidden mb-6 border border-surface-800/50">
          <iframe
            src={tutorial.video_url}
            title={tutorial.title}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      )}

      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="badge-green capitalize">{tutorial.difficulty_level}</span>
          <span className="badge-neutral capitalize flex items-center gap-1">
            <Icon className="w-3 h-3" />
            {tutorial.content_type}
          </span>
          {tutorial.duration_minutes > 0 && (
            <span className="flex items-center gap-1 text-xs text-surface-500">
              <Clock className="w-3 h-3" />
              {tutorial.duration_minutes} min
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">{tutorial.title}</h1>

        <div className="flex flex-wrap items-center gap-3 mt-4">
          {tutorial.author_name && (
            <p className="text-sm text-surface-400">
              By <span className="text-surface-200">{tutorial.author_name}</span>
            </p>
          )}
          <div className="flex items-center gap-2 ml-auto">
            {user?.id === tutorial.user_id && (
              <Link to={`/tutorials/${tutorial.slug}/edit`} className="btn-secondary text-sm">
                <Pencil className="w-4 h-4" />
                Edit
              </Link>
            )}
            <FavoriteButton
              isFavorite={isFavorite('tutorials', tutorial.id)}
              onToggle={() => toggleFavorite('tutorials', tutorial.id)}
            />
          </div>
        </div>
      </div>

      <div className="glass-card p-6 mb-6">
        <p className="text-surface-300 leading-relaxed whitespace-pre-line">{tutorial.description}</p>
      </div>

      {tool && (
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-surface-300 mb-3">Related Tool</h3>
          <Link to={`/tools/${tool.slug}`} className="flex items-center gap-3 p-3 rounded-xl bg-surface-800/50 hover:bg-surface-800 border border-surface-700/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-surface-700 border border-surface-600/50 overflow-hidden flex-shrink-0 flex items-center justify-center">
              {tool.logo_url ? (
                <img src={tool.logo_url} alt={tool.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-surface-400">{tool.name.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-surface-200">{tool.name}</h4>
              <p className="text-xs text-surface-500 line-clamp-1">{tool.tagline}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-surface-500" />
          </Link>
        </div>
      )}
    </div>
  );
}
