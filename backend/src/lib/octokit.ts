import { Octokit } from '@octokit/rest';

const githubToken = process.env.GITHUB_TOKEN;

if (!githubToken) {
  console.warn(
    '⚠️  WARNING: GITHUB_TOKEN is not set in environment variables. GitHub API calls will fail.',
  );
}

export const octokit = new Octokit(
  githubToken
    ? {
        auth: githubToken,
      }
    : undefined,
);

