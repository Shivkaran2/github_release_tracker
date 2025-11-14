import type { GraphQLContext } from '../context';

export const queryResolvers = {
  repositories: (_: unknown, _args: unknown, context: GraphQLContext) =>
    context.repositoryService.listRepositories(context.userId),
  repository: (
    _: unknown,
    args: { owner: string; name: string },
    context: GraphQLContext,
  ) =>
    context.repositoryService.findRepositoryByOwnerAndName(
      args.owner,
      args.name,
      context.userId,
    ),
  repositoryById: (_: unknown, args: { id: string }, context: GraphQLContext) =>
    context.repositoryService.findRepositoryById(args.id, context.userId),
  me: async (_: unknown, _args: unknown, context: GraphQLContext) => {
    if (!context.isAuthenticated) {
      return null;
    }
    const { prisma } = await import('../lib/prisma');
    const user = await prisma.user.findUnique({
      where: { id: context.userId },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
      },
    });
    return user;
  },
};

