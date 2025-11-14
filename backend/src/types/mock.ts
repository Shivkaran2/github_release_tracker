export interface MockRepository {
  id: string;
  owner: string;
  name: string;
  description: string | null;
  url: string;
  lastSyncedAt: string | null;
  releases: MockRelease[];
}

export interface MockRelease {
  id: string;
  version: string;
  publishedAt: string | null;
  notes: string | null;
  isSeen: boolean;
  url: string | null;
}

