import type { Repository } from '../types/repository';

type RepositoryListProps = {
  repositories: Repository[];
  activeRepositoryId: string | null;
  onSelectRepository: (repositoryId: string) => void;
  onMarkSeen: (repositoryId: string, unseenReleaseId: string) => void;
};

export function RepositoryList({
  repositories,
  activeRepositoryId,
  onSelectRepository,
  onMarkSeen,
}: RepositoryListProps) {
  return (
    <div className="repository-list-container">
      <div className="repository-list">
        {repositories.length === 0 ? (
          <p className="empty-state">Add a repository to start tracking releases.</p>
        ) : (
          repositories.map((repository) => {
          const latestRelease = repository.releases[0] ?? null;
          const isActive = repository.id === activeRepositoryId;
          const unseenRelease = repository.releases.find(
            (release) => release.isSeen === false,
          );

          return (
            <button
              type="button"
              key={repository.id}
              className={`repository-card${isActive ? ' active' : ''}`}
              onClick={() => onSelectRepository(repository.id)}
            >
              <div className="repository-card-header">
                <span className="repository-name text-white" style={{ color: 'wheat' }}>
                  {repository.owner}/{repository.name}
                </span>
                {repository.hasUnseenRelease ? (
                  <span className="badge badge-new">New!</span>
                ) : null}
              </div>
              <p className="repository-description">
                {repository.description ?? 'No description provided.'}
              </p>
              {latestRelease ? (
                <div className="repository-release">
                  <span className="release-version text-white">{latestRelease.version}</span>
                  <span className="release-date">
                    {latestRelease.publishedAt
                      ? new Date(latestRelease.publishedAt).toLocaleDateString()
                      : 'Unreleased'}
                  </span>
                </div>
              ) : (
                <p className="repository-no-release">No releases yet.</p>
              )}
              {unseenRelease && (
                <div className="repository-actions">
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={(event) => {
                      event.stopPropagation();
                      onMarkSeen(repository.id, unseenRelease.id);
                    }}
                  >
                    Mark seen
                  </button>
                </div>
              )}
            </button>
          );
        })
        )}
      </div>
    </div>
  );
}



