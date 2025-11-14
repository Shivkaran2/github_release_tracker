export interface Release {
  id: string;
  version: string;
  publishedAt: string | null;
  notes: string | null;
  isSeen: boolean;
  url?: string | null;
}

export interface Repository {
  id: string;
  owner: string;
  name: string;
  description?: string | null;
  url: string;
  lastSyncedAt: string | null;
  hasUnseenRelease: boolean;
  releases: Release[];
}

