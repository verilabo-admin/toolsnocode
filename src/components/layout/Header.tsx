import React from 'react';
import { Link } from 'react-router-dom';
import { Home, User, LogOut, CreditCard } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { SubscriptionStatus } from '../subscription/SubscriptionStatus';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">ToolsNoCode</span>
          </Link>

          <nav className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/pricing"
                  className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Pricing</span>
                </Link>
                <div className="flex items-center space-x-1 text-gray-700 px-3 py-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <button
                  onClick={signOut}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
        
        {user && (
          <div className="pb-4">
            <SubscriptionStatus />
          </div>
        )}
      </div>
    </header>
  );
}