import React from 'react';
import { Helmet } from 'react-helmet-async';
import { PricingCard } from '../components/PricingCard';
import { STRIPE_PRODUCTS } from '../stripe-config';

export function PricingPage() {
  return (
    <>
      <Helmet>
        <title>Pricing - ToolsNoCode</title>
        <meta name="description" content="Choose the perfect plan for your no-code and AI tool needs." />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlock the full potential of ToolsNoCode with our subscription plan.
              Get access to premium features and exclusive content.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="max-w-md">
              {STRIPE_PRODUCTS.map((product) => (
                <PricingCard
                  key={product.id}
                  product={product}
                  isPopular={true}
                />
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              What's Included
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-emerald-600 text-xl">🚀</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Premium Tools</h3>
                <p className="text-gray-600">Access to exclusive no-code and AI tools</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-emerald-600 text-xl">📚</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Expert Tutorials</h3>
                <p className="text-gray-600">Step-by-step guides from industry experts</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-emerald-600 text-xl">💬</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Priority Support</h3>
                <p className="text-gray-600">Get help when you need it most</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}