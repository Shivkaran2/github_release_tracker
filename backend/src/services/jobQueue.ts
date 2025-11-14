interface Job {
  id: string;
  type: 'refresh-repository' | 'refresh-all' | 'sync-release';
  payload: unknown;
  priority: number;
  createdAt: Date;
}

export class JobQueue {
  private queue: Job[] = [];
  private processing = false;
  private maxConcurrent = 3;
  private activeJobs = 0;

  async enqueue(
    type: Job['type'],
    payload: unknown,
    priority = 0,
  ): Promise<string> {
    const job: Job = {
      id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      payload,
      priority,
      createdAt: new Date(),
    };

    this.queue.push(job);
    this.queue.sort((a, b) => b.priority - a.priority);

    if (!this.processing) {
      this.startProcessing();
    }

    return job.id;
  }

  private async startProcessing(): Promise<void> {
    this.processing = true;

    while (this.queue.length > 0 || this.activeJobs > 0) {
      if (this.activeJobs < this.maxConcurrent && this.queue.length > 0) {
        const job = this.queue.shift();
        if (job) {
          this.activeJobs++;
          this.processJob(job).finally(() => {
            this.activeJobs--;
          });
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    this.processing = false;
  }

  private async processJob(job: Job): Promise<void> {
    try {
      switch (job.type) {
        case 'refresh-repository': {
          const { repositoryId, userId } = job.payload as {
            repositoryId: string;
            userId: string;
          };
          const { repositoryService } = await import('./repositoryService');
          await repositoryService.refreshRepository(repositoryId, userId);
          break;
        }
        case 'refresh-all': {
          const { userId } = job.payload as { userId: string };
          const { repositoryService } = await import('./repositoryService');
          await repositoryService.refreshAllRepositories(userId);
          break;
        }
        case 'sync-release': {
          const { repositoryId } = job.payload as { repositoryId: string };
          const { repositoryService } = await import('./repositoryService');
          await repositoryService.refreshRepository(repositoryId, 'default-user');
          break;
        }
      }
    } catch (error) {}
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  getActiveJobs(): number {
    return this.activeJobs;
  }
}

export const jobQueue = new JobQueue();


