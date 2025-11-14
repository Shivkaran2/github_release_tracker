const TOKEN_KEY = 'github_tracker_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getAuthUrl(): string {
  const backendUrl = import.meta.env.VITE_GRAPHQL_URL?.replace('/graphql', '') || 'http://localhost:4000';
  return `${backendUrl}/auth/github`;
}

