import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SubscriptionCard } from '../components/subscription/SubscriptionCard';
import { stripeProducts } from '../stripe-config';

export function PricingPage() {
  return (
    <>
      <Helmet>
        <title>Pricing - ToolsNoCode</title>
        <meta name="description" content="Choose the perfect plan for your needs" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Choose Your Plan
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Unlock the full potential of your tools with our subscription plans
            </p>
          </div>

          <div className="mt-16 flex justify-center">
            <div className="max-w-md">
              {stripeProducts.map((product) => (
                <SubscriptionCard key={product.priceId} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}