import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('queue') private queue: Queue,
  ) { }

  async addImmediateJob(jobData: any) {
    await this.queue.add('immediateJob', jobData);
  }

  async addDelayedJob(
    jobData: any,
    delay: number,
  ) {
    await this.queue.add('delayedJob', jobData, {
      delay,
    });
  }

  async addRecurrentJob(
    jobData: any,
    cron: string,
  ) {
    await this.queue.add(
      'recurrentJob',
      jobData,
      { repeat: { cron } },
    );
  }
  async addPriorityJob(
    jobData: any,
    priority: number,
  ) {
    await this.queue.add('priorityJob', jobData, {
      priority,
    });
  }
  async addLimitedAttemptJob(
    jobData: any,
    attempts: number,
  ) {
    await this.queue.add(
      'limitedAttemptJob',
      jobData,
      { attempts },
    );
  }
  async getJob(jobId: string) {
    return await this.queue.getJob(jobId);
  }

  async updateJob(jobId: string, newData: any) {
    const job = await this.getJob(jobId);
    if (job) {
      await job.update(newData);
    }
  }

  async removeJob(jobId: string) {
    const job = await this.getJob(jobId);
    if (job) {
      await job.remove();
    }
  }
}
