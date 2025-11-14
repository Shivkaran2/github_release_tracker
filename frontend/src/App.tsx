import { useQuery } from '@apollo/client';
import { ME_QUERY } from './graphql';
import { useRepositories } from './hooks/useRepositories';
import { useRepositorySelection } from './hooks/useRepositorySelection';
import { AddRepositoryForm } from './components/AddRepositoryForm';
import { RepositoryView } from './components/RepositoryView';
import { AuthButton } from './components/AuthButton';
import { AuthPrompt } from './components/AuthPrompt';

export function App() {
  const { data: userData } = useQuery(ME_QUERY, {
    errorPolicy: 'ignore',
  });
  const isAuthenticated = !!userData?.me;

  const {
    repositories,
    loading,
    error,
    refreshing,
    handleMarkSeen,
    handleRefresh,
    handleDelete: handleDeleteRepository,
  } = useRepositories(isAuthenticated);

  const selection = useRepositorySelection(repositories);

  const handleDelete = async (repositoryId: string) => {
    await handleDeleteRepository(repositoryId);
    selection.handleDelete();
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div>
          <h1>GitHub Release Tracker</h1>
          <p>Track updates across your favorite open-source repositories.</p>
        </div>
        <div className="header-actions">
          <AuthButton />
        </div>
      </header>

      {!isAuthenticated ? (
        <AuthPrompt />
      ) : (
        <>
          <AddRepositoryForm onAdded={selection.handleAdded} />
          <RepositoryView
            repositories={repositories}
            loading={loading}
            error={error}
            refreshing={refreshing}
            onMarkSeen={handleMarkSeen}
            onRefresh={handleRefresh}
            onDelete={handleDelete}
            selection={selection}
          />
        </>
      )}
    </div>
  );
}
