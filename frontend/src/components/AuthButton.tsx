import { useQuery } from '@apollo/client';
import { getAuthUrl, removeToken } from '../utils/auth';
import { ME_QUERY } from '../graphql';

export function AuthButton() {
  const { data, loading } = useQuery(ME_QUERY, {
    errorPolicy: 'ignore',
  });

  const user = data?.me;

  if (loading) {
    return <div className="auth-button">Loading...</div>;
  }

  if (user) {
    return (
      <div className="auth-button">
        <div className="user-info">
          {user.avatarUrl && (
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="user-avatar"
              width={32}
              height={32}
            />
          )}
          <span className="user-name">{user.username}</span>
        </div>
        <button
          type="button"
          onClick={() => {
            removeToken();
            window.location.reload();
          }}
          className="logout-button"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="auth-button">
      <a href={getAuthUrl()} className="login-button">
        Login with GitHub
      </a>
    </div>
  );
}

