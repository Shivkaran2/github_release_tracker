import { useEffect } from 'react';
import { setToken } from '../utils/auth';

export function AuthSuccess() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      setToken(token);
      setTimeout(() => {
        window.location.href = window.location.origin;
      }, 1000);
    }
  }, []);

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (token) {
    return (
      <div className="auth-page">
        <div className="auth-page-content">
          <h2>✅ Authentication Successful!</h2>
          <p>Redirecting to the app...</p>
          <div className="auth-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-page-content">
        <h2>❌ Authentication Error</h2>
        <p>No token received. Please try again.</p>
        <a href={window.location.origin} className="auth-page-link">Go to Home</a>
      </div>
    </div>
  );
}

