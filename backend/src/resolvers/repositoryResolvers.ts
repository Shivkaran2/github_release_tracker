import type { GraphQLContext } from '../context';
import type { GraphQLRepository } from '../types/graphql';

export const repositoryResolvers = {
  latestRelease: (repository: GraphQLRepository) =>
    [...repository.releases].sort((a, b) => {
      const dateA = a.publishedAt ? Date.parse(a.publishedAt) : 0;
      const dateB = b.publishedAt ? Date.parse(b.publishedAt) : 0;
      return dateB - dateA;
    })[0] ?? null,
  hasUnseenRelease: (repository: GraphQLRepository) =>
    repository.releases.some((release) => !release.isSeen),
};

