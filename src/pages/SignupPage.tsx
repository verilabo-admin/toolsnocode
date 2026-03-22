import { SignupForm } from '../components/auth/SignupForm';
import { useSEO } from '../hooks/useSEO';

export function SignupPage() {
  useSEO({
    title: 'Create Account',
    description: 'Create a free ToolsNoCode account to publish tools, tutorials, and connect with the no-code community.',
    url: '/signup',
    noindex: true,
  });

  return <SignupForm />;
}