import type { PrismaClient } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { GitHubService, githubService } from './githubService';
import type { GitHubRelease } from '../types/github';
import type {
  RepositoryIncludeOptions,
  RepositoryWithRelations,
  RepositoryResponse,
} from '../types/repository';
import { DEFAULT_USER_ID } from '../constants';

export class RepositoryService {
  constructor(
    private readonly client: PrismaClient,
    private readonly github: GitHubService,
  ) {}

  async listRepositories(userId: string = DEFAULT_USER_ID) {
    const whereClause =
      userId !== DEFAULT_USER_ID
        ? {
            users: {
              some: {
                userId,
              },
            },
          }
        : {};

    const repositories = await this.client.repository.findMany({
      where: whereClause,
      include: this.repositoryInclude(userId),
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return repositories.map((repository) => this.mapRepository(repository));
  }

  async findRepositoryByOwnerAndName(
    owner: string,
    name: string,
    userId: string = DEFAULT_USER_ID,
  ) {
    const repository = await this.client.repository.findUnique({
      where: {
        owner_name: {
          owner,
          name,
        },
      },
      include: this.repositoryInclude(userId),
    });

    if (!repository) {
      return null;
    }

    return this.mapRepository(repository);
  }

  async findRepositoryById(id: string, userId: string = DEFAULT_USER_ID) {
    const repository = await this.client.repository.findUnique({
      where: { id },
      include: this.repositoryInclude(userId),
    });

    if (!repository) {
      return null;
    }

    return this.mapRepository(repository);
  }

  async addRepositoryByUrl(url: string, userId: string = DEFAULT_USER_ID) {
    const parsed = this.parseRepositoryUrl(url);
    if (!parsed) {
      throw new Error('URL must be a valid GitHub repository URL');
    }

    const { owner, name } = parsed;
    const remote = await this.github.fetchRepositoryWithReleases(owner, name);

    const existing = await this.client.repository.findUnique({
      where: {
        owner_name: {
          owner,
          name,
        },
      },
    });

    const repositoryRecord = existing
      ? await this.client.repository.update({
          where: { id: existing.id },
          data: {
            description: remote.repository.description ?? undefined,
            url: remote.repository.html_url,
            lastSyncedAt: new Date(),
          },
        })
      : await this.client.repository.create({
          data: {
            owner,
            name,
            description: remote.repository.description ?? undefined,
            url: remote.repository.html_url,
            lastSyncedAt: new Date(),
          },
        });

    await this.syncReleases(repositoryRecord.id, remote.releases);

    if (userId !== DEFAULT_USER_ID) {
      await this.client.userRepository.upsert({
        where: {
          userId_repositoryId: {
            userId,
            repositoryId: repositoryRecord.id,
          },
        },
        update: {},
        create: {
          userId,
          repositoryId: repositoryRecord.id,
        },
      });
    }

    return this.findRepositoryById(repositoryRecord.id, userId);
  }

  async markReleaseSeen(
    repositoryId: string,
    releaseId: string,
    userId: string = DEFAULT_USER_ID,
  ) {
    await this.client.repository.findUniqueOrThrow({
      where: { id: repositoryId },
    });

    await this.client.release.findUniqueOrThrow({
      where: { id: releaseId },
    });

    await this.client.releaseSeen.upsert({
      where: {
        releaseId_userId: {
          releaseId,
          userId,
        },
      },
      update: {
        seenAt: new Date(),
      },
      create: {
        releaseId,
        userId,
        seenAt: new Date(),
      },
    });

    return this.findRepositoryById(repositoryId, userId).then((repository) => {
      if (!repository) {
        throw new Error('Repository not found after updating release status');
      }

      const release = repository.releases.find((item) => item.id === releaseId);
      if (!release) {
        throw new Error('Release not found after updating status');
      }

      return release;
    });
  }

  async refreshRepository(
    repositoryId: string,
    userId: string = DEFAULT_USER_ID,
  ) {
    const repository = await this.client.repository.findUniqueOrThrow({
      where: { id: repositoryId },
    });

    const remote = await this.github.fetchRepositoryWithReleases(
      repository.owner,
      repository.name,
    );

    await this.client.repository.update({
      where: { id: repository.id },
      data: {
        description: remote.repository.description ?? undefined,
        url: remote.repository.html_url,
        lastSyncedAt: new Date(),
      },
    });

    await this.syncReleases(repository.id, remote.releases);

    return this.findRepositoryById(repository.id, userId);
  }

  async refreshAllRepositories(userId: string = DEFAULT_USER_ID) {
    const repositories = await this.client.repository.findMany();

    for (const repository of repositories) {
      try {
        await this.refreshRepository(repository.id, userId);
      } catch (error) {}
    }

    return this.listRepositories(userId);
  }

  async deleteRepository(repositoryId: string, userId: string = DEFAULT_USER_ID) {
    if (userId !== DEFAULT_USER_ID) {
      await this.client.userRepository.deleteMany({
        where: {
          repositoryId,
          userId,
        },
      });
    } else {
      await this.client.repository.delete({
        where: { id: repositoryId },
      });
    }
    return true;
  }

  private async syncReleases(
    repositoryId: string,
    releases: GitHubRelease[],
  ) {
    const activeReleaseIds: string[] = [];

    for (const release of releases) {
      const record = await this.client.release.upsert({
        where: {
          repositoryId_tagName: {
            repositoryId,
            tagName: release.tag_name,
          },
        },
        update: {
          title: release.name ?? undefined,
          notes: release.body ?? undefined,
          publishedAt: release.published_at
            ? new Date(release.published_at)
            : undefined,
          isDraft: release.draft,
          isPrerelease: release.prerelease,
          htmlUrl: release.html_url ?? undefined,
        },
        create: {
          repositoryId,
          tagName: release.tag_name,
          title: release.name ?? undefined,
          notes: release.body ?? undefined,
          publishedAt: release.published_at
            ? new Date(release.published_at)
            : undefined,
          isDraft: release.draft,
          isPrerelease: release.prerelease,
          htmlUrl: release.html_url ?? undefined,
        },
      });

      activeReleaseIds.push(record.id);
    }

    await this.client.release.deleteMany({
      where: {
        repositoryId,
        ...(activeReleaseIds.length > 0
          ? {
              id: {
                notIn: activeReleaseIds,
              },
            }
          : {}),
      },
    });
  }

  private repositoryInclude(userId: string): RepositoryIncludeOptions {
    return {
      releases: {
        include: {
          seenStatuses: {
            where: {
              userId,
            },
          },
        },
        orderBy: [
          {
            publishedAt: 'desc',
          },
          {
            createdAt: 'desc',
          },
        ],
      },
    };
  }

  private mapRepository(repository: RepositoryWithRelations) {
    return {
      id: repository.id,
      owner: repository.owner,
      name: repository.name,
      description: repository.description,
      url: repository.url,
      lastSyncedAt: repository.lastSyncedAt?.toISOString() ?? null,
      releases: repository.releases.map((release) => ({
        id: release.id,
        version: release.tagName,
        publishedAt: release.publishedAt?.toISOString() ?? null,
        notes: release.notes,
        isSeen: release.seenStatuses.length > 0,
        url: release.htmlUrl,
      })),
    };
  }

  private parseRepositoryUrl(url: string) {
    const match = url
      .trim()
      .match(/^https?:\/\/github\.com\/([\w.-]+)\/([\w.-]+)/i);
    if (!match) {
      return null;
    }

    const [, owner, name] = match;
    return { owner, name };
  }
}

export const repositoryService = new RepositoryService(prisma, githubService);

