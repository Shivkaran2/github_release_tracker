import type { Release, Repository } from '../types/repository';

type ReleasePanelProps = {
  repository: Repository;
  activeRelease: Release | null;
  onSelectRelease: (release: Release) => void;
  onDelete: (repositoryId: string) => void;
};

export function ReleasePanel({
  repository,
  activeRelease,
  onSelectRelease,
  onDelete,
}: ReleasePanelProps) {
  const releases = repository.releases;

  return (
    <section className="release-panel">
      <header className="release-panel-header">
        <div>
          <h2>
            {repository.owner}/{repository.name}
          </h2>
          <p>{repository.description ?? 'No description provided.'}</p>
        </div>
        <div className="release-panel-meta">
          <span>
            {repository.lastSyncedAt
              ? `Synced ${new Date(repository.lastSyncedAt).toLocaleString()}`
              : 'Not synced yet'}
          </span>
          <a
            href={repository.url}
            className="button-link"
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub ↗
          </a>
          <button
            type="button"
            className="button-delete"
            onClick={() => {
              if (
                confirm(
                  `Are you sure you want to remove ${repository.owner}/${repository.name} from tracking?`,
                )
              ) {
                onDelete(repository.id);
              }
            }}
          >
            Delete Repository
          </button>
        </div>
      </header>

      {releases.length === 0 ? (
        <p>No releases available for this repository.</p>
      ) : (
        <div className="release-panel-columns">
          <aside className="release-list">
            {releases.map((release) => {
              const isActive = release.id === activeRelease?.id;
              return (
                <button
                  type="button"
                  key={release.id}
                  className={`release-list-item${isActive ? ' active' : ''}`}
                  onClick={() => onSelectRelease(release)}
                >
                  <span className="release-list-version text-white" style={{ color: 'white' }}>{release.version}</span>
                  <span className="release-list-date">
                    {release.publishedAt
                      ? new Date(release.publishedAt).toLocaleString()
                      : 'Draft'}
                  </span>
                  {!release.isSeen ? (
                    <span className="badge badge-unseen">Unseen</span>
                  ) : null}
                </button>
              );
            })}
          </aside>

          <article className="release-details">
            {activeRelease ? (
              <>
                <h3>{activeRelease.version}</h3>
                <p className="release-details-meta">
                  {activeRelease.publishedAt
                    ? new Date(activeRelease.publishedAt).toLocaleString()
                    : 'Draft release'}
                </p>
                {activeRelease.url ? (
                  <a
                    href={activeRelease.url}
                    target="_blank"
                    rel="noreferrer"
                    className="button-link"
                  >
                    Open release on GitHub ↗
                  </a>
                ) : null}
                <div className="release-notes">
                  {activeRelease.notes ? (
                    <pre>{activeRelease.notes}</pre>
                  ) : (
                    <p>No release notes provided.</p>
                  )}
                </div>
              </>
            ) : (
              <p>Select a release to view notes.</p>
            )}
          </article>
        </div>
      )}
    </section>
  );
}



