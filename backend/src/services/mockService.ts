import type { RepositoryService } from './repositoryService';
import type { MockRepository, MockRelease } from '../types/mock';

const MOCK_DATA: MockRepository[] = [
  {
    id: 'mock-1',
    owner: 'facebook',
    name: 'react',
    description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
    url: 'https://github.com/facebook/react',
    lastSyncedAt: new Date().toISOString(),
    releases: [
      {
        id: 'mock-release-1',
        version: 'v18.2.0',
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'React 18.2.0 includes bug fixes and performance improvements.',
        isSeen: false,
        url: 'https://github.com/facebook/react/releases/tag/v18.2.0',
      },
      {
        id: 'mock-release-2',
        version: 'v18.1.0',
        publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'React 18.1.0 release notes.',
        isSeen: true,
        url: 'https://github.com/facebook/react/releases/tag/v18.1.0',
      },
    ],
  },
  {
    id: 'mock-2',
    owner: 'vercel',
    name: 'next.js',
    description: 'The React Framework for Production',
    url: 'https://github.com/vercel/next.js',
    lastSyncedAt: new Date().toISOString(),
    releases: [
      {
        id: 'mock-release-3',
        version: 'v14.0.0',
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Next.js 14.0.0 - Major release with new features.',
        isSeen: false,
        url: 'https://github.com/vercel/next.js/releases/tag/v14.0.0',
      },
    ],
  },
  {
    id: 'mock-3',
    owner: 'microsoft',
    name: 'typescript',
    description: 'TypeScript is a superset of JavaScript that compiles to clean JavaScript output.',
    url: 'https://github.com/microsoft/TypeScript',
    lastSyncedAt: new Date().toISOString(),
    releases: [
      {
        id: 'mock-release-4',
        version: 'v5.3.0',
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'TypeScript 5.3.0 includes new language features and improvements.',
        isSeen: false,
        url: 'https://github.com/microsoft/TypeScript/releases/tag/v5.3.0',
      },
    ],
  },
];

export class MockService {
  async listRepositories(userId?: string): Promise<MockRepository[]> {
    await this.delay(300);
    return MOCK_DATA;
  }

  async findRepositoryByOwnerAndName(
    owner: string,
    name: string,
    userId?: string,
  ): Promise<MockRepository | null> {
    await this.delay(200);
    return (
      MOCK_DATA.find((repo) => repo.owner === owner && repo.name === name) || null
    );
  }

  async findRepositoryById(id: string, userId?: string): Promise<MockRepository | null> {
    await this.delay(200);
    return MOCK_DATA.find((repo) => repo.id === id) || null;
  }

  async addRepositoryByUrl(url: string, userId?: string): Promise<MockRepository> {
    await this.delay(500);
    const match = url.match(/github\.com\/([\w.-]+)\/([\w.-]+)/);
    if (!match) {
      throw new Error('Invalid GitHub repository URL');
    }

    const [, owner, name] = match;
    const newRepo: MockRepository = {
      id: `mock-${Date.now()}`,
      owner,
      name,
      description: `Mock repository for ${owner}/${name}`,
      url,
      lastSyncedAt: new Date().toISOString(),
      releases: [
        {
          id: `mock-release-${Date.now()}`,
          version: 'v1.0.0',
          publishedAt: new Date().toISOString(),
          notes: 'Initial release',
          isSeen: false,
          url: `${url}/releases/tag/v1.0.0`,
        },
      ],
    };

    MOCK_DATA.push(newRepo);
    return newRepo;
  }

  async markReleaseSeen(
    repositoryId: string,
    releaseId: string,
    userId?: string,
  ): Promise<MockRelease> {
    await this.delay(200);
    const repository = MOCK_DATA.find((repo) => repo.id === repositoryId);
    if (!repository) {
      throw new Error('Repository not found');
    }

    const release = repository.releases.find((r) => r.id === releaseId);
    if (!release) {
      throw new Error('Release not found');
    }

    release.isSeen = true;
    return release;
  }

  async refreshRepository(id: string, userId?: string): Promise<MockRepository> {
    await this.delay(500);
    const repository = MOCK_DATA.find((repo) => repo.id === id);
    if (!repository) {
      throw new Error('Repository not found');
    }

    repository.lastSyncedAt = new Date().toISOString();
    return repository;
  }

  async refreshAllRepositories(userId?: string): Promise<MockRepository[]> {
    await this.delay(1000);
    MOCK_DATA.forEach((repo) => {
      repo.lastSyncedAt = new Date().toISOString();
    });
    return MOCK_DATA;
  }

  async deleteRepository(id: string, userId?: string): Promise<boolean> {
    await this.delay(200);
    const index = MOCK_DATA.findIndex((repo) => repo.id === id);
    if (index === -1) {
      throw new Error('Repository not found');
    }
    MOCK_DATA.splice(index, 1);
    return true;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockService = new MockService();

