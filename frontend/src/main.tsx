import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './apolloClient';
import { App } from './App';
import { AuthSuccess } from './pages/AuthSuccess';
import { AuthError } from './pages/AuthError';
import './styles.css';

const rootElement = document.getElementById('app');

if (!rootElement) {
  throw new Error('Failed to find root element');
}

function Router() {
  const path = window.location.pathname;

  if (path === '/auth/success') {
    return <AuthSuccess />;
  }

  if (path === '/auth/error') {
    return <AuthError />;
  }

  return <App />;
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <Router />
    </ApolloProvider>
  </React.StrictMode>,
);




