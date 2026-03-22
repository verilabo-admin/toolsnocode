import { LoginForm } from '../components/auth/LoginForm';
import { useSEO } from '../hooks/useSEO';

export function LoginPage() {
  useSEO({
    title: 'Sign In',
    description: 'Sign in to your ToolsNoCode account to manage tools, favorites, and content.',
    url: '/login',
    noindex: true,
  });

  return <LoginForm />;
}