import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SignupForm } from '../components/auth/SignupForm';

export function SignupPage() {
  return (
    <>
      <Helmet>
        <title>Sign Up - ToolsNoCode</title>
        <meta name="description" content="Create your ToolsNoCode account" />
      </Helmet>
      <SignupForm />
    </>
  );
}