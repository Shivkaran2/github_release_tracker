export interface GraphQLRelease {
  id: string;
  version: string;
  publishedAt: string | null;
  notes?: string | null;
  isSeen: boolean;
}

export interface GraphQLRepository {
  id: string;
  owner: string;
  name: string;
  description?: string | null;
  url: string;
  releases: GraphQLRelease[];
}

export interface GraphQLQueryArgs {
  owner?: string;
  name?: string;
  id?: string;
}

export interface GraphQLMutationArgs {
  url?: string;
  repositoryId?: string;
  releaseId?: string;
  id?: string;
}

