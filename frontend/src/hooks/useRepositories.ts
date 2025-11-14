import { useMutation, useQuery } from '@apollo/client';
import {
  MARK_RELEASE_SEEN_MUTATION,
  REPOSITORIES_QUERY,
  REFRESH_REPOSITORIES_MUTATION,
  DELETE_REPOSITORY_MUTATION,
} from '../graphql';
import type { Repository } from '../types/repository';

export function useRepositories(isAuthenticated: boolean) {
  const { data, loading, error } = useQuery<{ repositories: Repository[] }>(
    REPOSITORIES_QUERY,
    {
      skip: !isAuthenticated,
      errorPolicy: 'all',
    },
  );

  const [markReleaseSeen] = useMutation(MARK_RELEASE_SEEN_MUTATION);
  const [refreshRepositories, { loading: refreshing }] = useMutation(
    REFRESH_REPOSITORIES_MUTATION,
    {
      refetchQueries: [REPOSITORIES_QUERY],
      awaitRefetchQueries: true,
    },
  );
  const [deleteRepository] = useMutation(DELETE_REPOSITORY_MUTATION, {
    refetchQueries: [REPOSITORIES_QUERY],
    awaitRefetchQueries: true,
  });

  const repositories = data?.repositories ?? [];

  const handleMarkSeen = async (repositoryId: string, releaseId: string) => {
    try {
      await markReleaseSeen({
        variables: {
          repositoryId,
          releaseId,
        },
        optimisticResponse: {
          markReleaseSeen: {
            __typename: 'Release',
            id: releaseId,
            version:
              repositories
                .find((repo) => repo.id === repositoryId)
                ?.releases.find((release) => release.id === releaseId)?.version ?? '',
            isSeen: true,
          },
        },
        update: (cache) => {
          cache.updateQuery(
            { query: REPOSITORIES_QUERY },
            (cachedData: { repositories: Repository[] } | null) => {
              if (!cachedData) {
                return cachedData;
              }

              return {
                repositories: cachedData.repositories.map((repo) =>
                  repo.id !== repositoryId
                    ? repo
                    : {
                        ...repo,
                        hasUnseenRelease: repo.releases.some(
                          (release) =>
                            release.id !== releaseId && !release.isSeen,
                        ),
                        releases: repo.releases.map((release) =>
                          release.id !== releaseId
                            ? { ...release, isSeen: true }
                            : release,
                        ),
                      },
                ),
              };
            },
          );
        },
      });
    } catch (mutationError) {}
  };

  const handleRefresh = async () => {
    try {
      await refreshRepositories();
    } catch (mutationError) {}
  };

  const handleDelete = async (repositoryId: string) => {
    try {
      await deleteRepository({
        variables: { id: repositoryId },
      });
    } catch (mutationError) {}
  };

  return {
    repositories,
    loading,
    error,
    refreshing,
    handleMarkSeen,
    handleRefresh,
    handleDelete,
  };
}

