import { octokit } from '../lib/octokit';
import type {
  GitHubRelease,
  GitHubRepository,
  GitHubRepositoryWithReleases,
} from '../types/github';

export class GitHubService {
  private readonly octokit = octokit;

  async fetchRepositoryWithReleases(owner: string, name: string) {
    if (!process.env.GITHUB_TOKEN) {
      throw new Error(
        'GitHub token is not configured. Please set GITHUB_TOKEN in your .env file.',
      );
    }

    try {
      const [repoResponse, releasesResponse] = await Promise.all([
        this.octokit.repos.get({
          owner,
          repo: name,
        }),
        this.octokit.repos.listReleases({
          owner,
          repo: name,
          per_page: 20,
        }),
      ]);

      const releases = releasesResponse.data as GitHubRelease[];

      return {
        repository: repoResponse.data as GitHubRepository,
        releases,
      } as GitHubRepositoryWithReleases;
    } catch (error: unknown) {
      if (error && typeof error === 'object') {
        const httpError = error as { status?: number; message?: string };
        
        if (httpError.status === 401 || httpError.message?.includes('Bad credentials')) {
          throw new Error(
            'GitHub authentication failed. Please check if your GITHUB_TOKEN is valid and not expired. Generate a new token at https://github.com/settings/tokens',
          );
        }
        
        if (httpError.status === 404) {
          throw new Error(
            'Repository not found or is private. If this is a private repository, make sure your GitHub token has access to it and includes the "repo" scope. Public repositories should be accessible without authentication.',
          );
        }
      }
      throw error;
    }
  }
}

export const githubService = new GitHubService();
