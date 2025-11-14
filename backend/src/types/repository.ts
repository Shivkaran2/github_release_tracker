import type { Prisma } from '@prisma/client';

export type RepositoryIncludeOptions = Prisma.RepositoryInclude;

export type RepositoryWithRelations = Prisma.RepositoryGetPayload<{
  include: {
    releases: {
      include: {
        seenStatuses: true;
      };
      orderBy: {
        publishedAt: 'desc' | 'asc';
        createdAt?: 'asc' | 'desc';
      };
    };
  };
}>;

export interface RepositoryResponse {
  id: string;
  owner: string;
  name: string;
  description: string | null;
  url: string;
  lastSyncedAt: string | null;
  releases: ReleaseResponse[];
}

export interface ReleaseResponse {
  id: string;
  version: string;
  publishedAt: string | null;
  notes: string | null;
  isSeen: boolean;
  url: string | null;
}

