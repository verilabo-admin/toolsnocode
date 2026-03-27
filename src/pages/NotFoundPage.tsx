import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function NotFoundPage() {
  useSEO({
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist or has been moved.',
    noindex: true,
  });

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-surface-800 mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
        <p className="text-surface-400 mb-8 leading-relaxed">
          The page you are looking for doesn't exist or has been moved. Try searching or go back to the homepage.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary text-sm">
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link to="/tools" className="btn-secondary text-sm">
            <Search className="w-4 h-4" />
            Browse Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
