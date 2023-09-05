import { Process, Processor, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';


@Processor('queue')
export class JobConsumer {
  @Process('immediateJob')
  async handleImmediateJob(job: Job<any>) {
    const jobData = job.data;
    // implement logic to process the immediateJob
  }

  @Process('delayedJob')
  async handleDelayedJob(job: Job<any>) {
    const jobData = job.data;
    // implement logic to process the delayedJob
  }

  @Process('recurrentJob')
  async handleRecurrentJob(job: Job<any>) {
    const jobData = job.data;
    // implement logic to process the recurrentJob
  }

  @Process('priorityJob')
  async handlePriorityJob(job: Job<any>) {
    const jobData = job.data;
    // implement logic to process the priorityJob
  }

  @Process('limitedAttemptJob')
  async handleLimitedAttemptJob(job: Job<any>) {
    const jobData = job.data;
    // implement logic to process the limitedAttemptJob
  }

  @OnQueueCompleted()
  async onQueueCompleted(job: Job<any>) {
    // This method will be automatically called when a job is completed without errors
    Logger.log(`Job completed successfully: ${job.name} - Job ID: ${job.id}`);
  }

  @OnQueueFailed()
  async onQueueFailed(job: Job<any>, error: Error) {
    // This method will be automatically called when a job encounters an error
    Logger.error(`Job failed: ${job.name} - Job ID: ${job.id} - Error: ${error.message}`);
  }
}
