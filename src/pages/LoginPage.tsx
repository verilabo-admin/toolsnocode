import React from 'react';
import { Helmet } from 'react-helmet-async';
import { LoginForm } from '../components/auth/LoginForm';

export function LoginPage() {
  return (
    <>
      <Helmet>
        <title>Sign In - ToolsNoCode</title>
        <meta name="description" content="Sign in to your ToolsNoCode account" />
      </Helmet>
      <LoginForm />
    </>
  );
}