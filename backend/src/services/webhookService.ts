import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { repositoryService } from './repositoryService';
import { DEFAULT_USER_ID } from '../constants';
import type { WebhookPayload } from '../types/webhook';

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '';

export class WebhookService {
  verifySignature(payload: string, signature: string): boolean {
    if (!WEBHOOK_SECRET) {
      return true;
    }

    const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
    const digest = 'sha256=' + hmac.update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
  }

  async handleReleaseEvent(payload: WebhookPayload): Promise<void> {
    if (!payload.repository || !payload.release) {
      return;
    }

    const { owner, name } = this.parseRepositoryName(payload.repository.full_name);
    if (!owner || !name) {
      return;
    }

    try {
      const repository = await prisma.repository.findUnique({
        where: {
          owner_name: {
            owner,
            name,
          },
        },
      });

      if (!repository) {
        return;
      }

      await repositoryService.refreshRepository(repository.id, DEFAULT_USER_ID);
    } catch (error) {}
  }

  async handleRepositoryEvent(payload: WebhookPayload): Promise<void> {
    if (!payload.repository) {
      return;
    }

    const { owner, name } = this.parseRepositoryName(payload.repository.full_name);
    if (!owner || !name) {
      return;
    }

    try {
      const url = payload.repository.html_url;
      await repositoryService.addRepositoryByUrl(url, DEFAULT_USER_ID);
    } catch (error) {}
  }

  async processWebhook(payload: WebhookPayload, event: string): Promise<void> {
    const { jobQueue } = await import('./jobQueue');

    switch (event) {
      case 'release':
      case 'releases':
        if (payload.action === 'published' || payload.action === 'edited') {
          if (payload.repository) {
            const { owner, name } = this.parseRepositoryName(payload.repository.full_name) || {};
            if (owner && name) {
              const { prisma } = await import('../lib/prisma');
              const repository = await prisma.repository.findUnique({
                where: { owner_name: { owner, name } },
              });
              if (repository) {
                await jobQueue.enqueue('sync-release', { repositoryId: repository.id }, 1);
              }
            }
          }
        }
        break;
      case 'repository':
        if (payload.action === 'created' || payload.action === 'publicized') {
          await this.handleRepositoryEvent(payload);
        }
        break;
      default:
        break;
    }
  }

  private parseRepositoryName(fullName: string): { owner: string; name: string } | null {
    const parts = fullName.split('/');
    if (parts.length !== 2) {
      return null;
    }
    return { owner: parts[0], name: parts[1] };
  }
}

export const webhookService = new WebhookService();

