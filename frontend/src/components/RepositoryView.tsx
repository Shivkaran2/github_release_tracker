import { useMemo, useState } from 'react';
import type { Repository } from '../types/repository';
import type { FilterStatus, SortOption } from '../types/filter';
import { filterAndSortRepositories } from '../utils/filterRepositories';
import { RepositoryControls } from './RepositoryControls';
import { RepositoryList } from './RepositoryList';
import { ReleasePanel } from './ReleasePanel';
import type { useRepositorySelectionReturn } from '../hooks/useRepositorySelection';

type RepositoryViewProps = {
  repositories: Repository[];
  loading: boolean;
  error: Error | undefined;
  refreshing: boolean;
  onMarkSeen: (repositoryId: string, releaseId: string) => void;
  onRefresh: () => void;
  onDelete: (repositoryId: string) => void;
  selection: useRepositorySelectionReturn;
};

export function RepositoryView({
  repositories,
  loading,
  error,
  refreshing,
  onMarkSeen,
  onRefresh,
  onDelete,
  selection,
}: RepositoryViewProps) {
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const filteredAndSortedRepositories = useMemo(
    () => filterAndSortRepositories(repositories, filterStatus, sortBy),
    [repositories, sortBy, filterStatus],
  );

  if (loading) {
    return (
      <div className="loading-state">
        <p>Loading repositories…</p>
      </div>
    );
  }

  if (error) {
    return (
      <p className="error-state">Failed to load repositories: {error.message}</p>
    );
  }

  if (repositories.length === 0) {
    return (
      <div className="empty-state-container">
        <div className="empty-state-content">
          <h2>No repositories tracked yet</h2>
          <p>Start by adding a repository using the form above.</p>
          <p className="empty-state-hint">
            Enter a GitHub repository URL like: github.com/facebook/react
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <aside className="repository-column">
        <RepositoryControls
          filterStatus={filterStatus}
          sortBy={sortBy}
          refreshing={refreshing}
          onFilterChange={setFilterStatus}
          onSortChange={setSortBy}
          onRefresh={onRefresh}
        />
        <RepositoryList
          repositories={filteredAndSortedRepositories}
          activeRepositoryId={selection.activeRepositoryId}
          onSelectRepository={selection.handleSelectRepository}
          onMarkSeen={onMarkSeen}
        />
      </aside>
      <section className="release-column">
        {selection.activeRepository ? (
          <ReleasePanel
            repository={selection.activeRepository}
            activeRelease={selection.activeRelease}
            onSelectRelease={selection.handleSelectRelease}
            onDelete={onDelete}
          />
        ) : (
          <div className="release-panel placeholder">
            <p>Select a repository to view release notes.</p>
          </div>
        )}
      </section>
    </div>
  );
}

