export type GitHubRelease = {
  id: number;
  tag_name: string;
  name: string | null;
  body: string | null;
  html_url: string | null;
  published_at: string | null;
  draft: boolean;
  prerelease: boolean;
};

export type GitHubRepository = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  owner: {
    login: string;
  };
};

export interface GitHubRepositoryWithReleases {
  repository: GitHubRepository;
  releases: GitHubRelease[];
}

