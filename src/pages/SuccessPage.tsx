import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, ArrowRight } from 'lucide-react';

export function SuccessPage() {
  useEffect(() => {
    // Clear any checkout-related data from localStorage
    localStorage.removeItem('checkout_session_id');
  }, []);

  return (
    <>
      <Helmet>
        <title>Payment Successful - ToolsNoCode</title>
        <meta name="description" content="Your payment was successful. Welcome to ToolsNoCode!" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <CheckCircle className="mx-auto h-16 w-16 text-emerald-500" />
            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Payment Successful!
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Thank you for subscribing to ToolsNoCode. Your account has been activated.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">What's Next?</h2>
            <ul className="text-left space-y-3 text-gray-600">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 mr-3 flex-shrink-0" />
                <span>Access to premium tools and features</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 mr-3 flex-shrink-0" />
                <span>Exclusive tutorials and expert content</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 mr-3 flex-shrink-0" />
                <span>Priority customer support</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <Link
              to="/"
              className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
            >
              Explore Tools
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            
            <Link
              to="/account"
              className="w-full flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Manage Account
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            You'll receive a confirmation email shortly with your subscription details.
          </p>
        </div>
      </div>
    </>
  );
}