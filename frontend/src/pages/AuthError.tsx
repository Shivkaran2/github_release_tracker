export function AuthError() {
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');
  const description = urlParams.get('description');

  const getErrorMessage = () => {
    if (error === 'missing_code') {
      return 'Authorization code was not received from GitHub.';
    }
    if (error === 'token_exchange_failed') {
      return 'Failed to exchange authorization code for access token.';
    }
    if (error === 'user_fetch_failed') {
      return 'Failed to fetch user information from GitHub.';
    }
    if (error === 'database_error') {
      return 'Failed to save user information to database.';
    }
    if (error === 'token_generation_failed') {
      return 'Failed to generate authentication token.';
    }
    if (error === 'unexpected_error') {
      return 'An unexpected error occurred during authentication.';
    }
    if (description) {
      return description;
    }
    return 'There was an error during authentication. Please try again.';
  };

  return (
    <div className="auth-page">
      <div className="auth-page-content">
        <h2>❌ Authentication Failed</h2>
        <p>{getErrorMessage()}</p>
        {error && (
          <p className="auth-error-code" style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.5rem' }}>
            Error code: {error}
          </p>
        )}
        <div style={{ marginTop: '1.5rem' }}>
          <a href={window.location.origin} className="auth-page-link">
            Go to Home
          </a>
          <a
            href={`${window.location.origin}/auth/github`}
            className="auth-page-link"
            style={{ marginLeft: '0.75rem', background: '#22c55e' }}
          >
            Try Again
          </a>
        </div>
      </div>
    </div>
  );
}

