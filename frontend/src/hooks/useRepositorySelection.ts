import { useEffect, useMemo, useState } from 'react';
import type { Release, Repository } from '../types/repository';

export type useRepositorySelectionReturn = {
  activeRepositoryId: string | null;
  activeRepository: Repository | null;
  activeRelease: Release | null;
  handleSelectRepository: (repositoryId: string) => void;
  handleSelectRelease: (release: Release) => void;
  handleAdded: (repository: Repository | null | undefined) => void;
  handleDelete: () => void;
};

export function useRepositorySelection(repositories: Repository[]): useRepositorySelectionReturn {
  const [activeRepositoryId, setActiveRepositoryId] = useState<string | null>(
    null,
  );
  const [activeRelease, setActiveRelease] = useState<Release | null>(null);

  const activeRepository = useMemo(() => {
    if (!activeRepositoryId) {
      return null;
    }
    return repositories.find((repo) => repo.id === activeRepositoryId) ?? null;
  }, [repositories, activeRepositoryId]);

  const handleSelectRepository = (repositoryId: string) => {
    setActiveRepositoryId((current) => {
      if (current === repositoryId) {
        setActiveRelease(null);
        return null;
      }
      const repo = repositories.find((item) => item.id === repositoryId);
      setActiveRelease(repo?.releases[0] ?? null);
      return repositoryId;
    });
  };

  const handleSelectRelease = (release: Release) => {
    setActiveRelease(release);
  };

  const handleAdded = (repository: Repository | null | undefined) => {
    if (repository) {
      setActiveRepositoryId(repository.id);
      setActiveRelease(repository.releases[0] ?? null);
    }
  };

  const handleDelete = () => {
    setActiveRepositoryId(null);
    setActiveRelease(null);
  };

  useEffect(() => {
    if (!activeRepository) {
      setActiveRelease(null);
      return;
    }

    setActiveRelease((current) => {
      if (!current) {
        return activeRepository.releases[0] ?? null;
      }

      const stillExists = activeRepository.releases.find(
        (release) => release.id === current.id,
      );

      return stillExists ?? activeRepository.releases[0] ?? null;
    });
  }, [activeRepository]);

  return {
    activeRepositoryId,
    activeRepository,
    activeRelease,
    handleSelectRepository,
    handleSelectRelease,
    handleAdded,
    handleDelete,
  };
}

