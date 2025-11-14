import { octokit } from '../lib/octokit';
import type {
  GitHubRelease,
  GitHubRepository,
  GitHubRepositoryWithReleases,
} from '../types/github';

export class GitHubService {
  private readonly octokit = octokit;

  async fetchRepositoryWithReleases(owner: string, name: string) {
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
    } catch (error) {
      throw error;
    }
  }
}

export const githubService = new GitHubService();
