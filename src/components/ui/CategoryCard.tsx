import { Link } from 'react-router-dom';
import {
  Bot, Code2, TrendingUp, Layers, Cpu, Image, Video, Mic,
  Globe, Smartphone, Workflow, Database, Link2, Search as SearchIcon,
  Mail, BarChart3, type LucideIcon,
} from 'lucide-react';
import type { Category } from '../../types';

const iconMap: Record<string, LucideIcon> = {
  bot: Bot,
  code2: Code2,
  trending: TrendingUp,
  layers: Layers,
  cpu: Cpu,
  image: Image,
  video: Video,
  mic: Mic,
  globe: Globe,
  smartphone: Smartphone,
  workflow: Workflow,
  database: Database,
  link2: Link2,
  search: SearchIcon,
  mail: Mail,
  barchart: BarChart3,
};

interface CategoryCardProps {
  category: Category;
  toolCount?: number;
}

export default function CategoryCard({ category, toolCount }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || Layers;

  return (
    <Link
      to={`/tools?category=${category.slug}`}
      className="glass-card-hover p-5 group block text-center"
    >
      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
        <Icon className="w-5 h-5 text-brand-400" />
      </div>
      <h3 className="text-sm font-semibold text-white group-hover:text-brand-400 transition-colors mb-1">
        {category.name}
      </h3>
      {toolCount !== undefined && (
        <p className="text-xs text-surface-500">{toolCount} tools</p>
      )}
    </Link>
  );
}
