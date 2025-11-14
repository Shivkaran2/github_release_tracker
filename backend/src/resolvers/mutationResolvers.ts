import type { GraphQLContext } from '../context';

export const mutationResolvers = {
  addRepository: (_: unknown, args: { url: string }, context: GraphQLContext) =>
    context.repositoryService.addRepositoryByUrl(args.url, context.userId),
  markReleaseSeen: (
    _: unknown,
    args: { repositoryId: string; releaseId: string },
    context: GraphQLContext,
  ) =>
    context.repositoryService.markReleaseSeen(
      args.repositoryId,
      args.releaseId,
      context.userId,
    ),
  refreshRepository: (
    _: unknown,
    args: { id: string },
    context: GraphQLContext,
  ) =>
    context.repositoryService.refreshRepository(args.id, context.userId),
  refreshRepositories: (_: unknown, _args: unknown, context: GraphQLContext) =>
    context.repositoryService.refreshAllRepositories(context.userId),
  deleteRepository: (
    _: unknown,
    args: { id: string },
    context: GraphQLContext,
  ) => context.repositoryService.deleteRepository(args.id, context.userId),
};

