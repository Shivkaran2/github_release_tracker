import { DateTimeScalar } from './resolvers/scalars';
import { repositoryResolvers } from './resolvers/repositoryResolvers';
import { queryResolvers } from './resolvers/queryResolvers';
import { mutationResolvers } from './resolvers/mutationResolvers';

export const resolvers = {
  DateTime: DateTimeScalar,
  Repository: repositoryResolvers,
  Query: queryResolvers,
  Mutation: mutationResolvers,
};

