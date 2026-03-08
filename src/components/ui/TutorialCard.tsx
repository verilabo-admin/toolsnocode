import { Link } from 'react-router-dom';
import { Play, Clock, BookOpen, Video, FileText, GraduationCap } from 'lucide-react';
import type { Tutorial } from '../../types';

const typeIcons: Record<string, typeof Play> = {
  video: Video,
  guide: BookOpen,
  course: GraduationCap,
  article: FileText,
};

const levelColors: Record<string, string> = {
  beginner: 'bg-brand-500/15 text-brand-400 border-brand-500/20',
  intermediate: 'bg-sky-500/15 text-sky-400 border-sky-500/20',
  advanced: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
};

interface TutorialCardProps {
  tutorial: Tutorial;
}

export default function TutorialCard({ tutorial }: TutorialCardProps) {
  const Icon = typeIcons[tutorial.content_type] || FileText;

  return (
    <Link to={`/tutorials/${tutorial.slug}`} className="glass-card-hover overflow-hidden group block">
      <div className="aspect-video bg-surface-800 relative overflow-hidden">
        {tutorial.thumbnail_url ? (
          <img
            src={tutorial.thumbnail_url}
            alt={tutorial.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-800 to-surface-900">
            <Icon className="w-10 h-10 text-surface-600" />
          </div>
        )}
        {tutorial.content_type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className={`badge border ${levelColors[tutorial.difficulty_level] || levelColors.beginner}`}>
            {tutorial.difficulty_level}
          </span>
          <span className="badge-neutral capitalize">{tutorial.content_type}</span>
        </div>

        <h3 className="text-base font-semibold text-white group-hover:text-brand-400 transition-colors line-clamp-2 mb-2">
          {tutorial.title}
        </h3>

        <p className="text-sm text-surface-400 line-clamp-2 mb-3">
          {tutorial.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-surface-500">{tutorial.author_name}</span>
          {tutorial.duration_minutes > 0 && (
            <span className="flex items-center gap-1 text-xs text-surface-500">
              <Clock className="w-3 h-3" />
              {tutorial.duration_minutes} min
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
