import Queue from 'bull';
import sendEmail from './emailHandler';

const REDIS_URL = 'redis://127.0.0.1:6379';

const queueOpts: Queue.QueueOptions = {
  limiter: {
    max: 100,
    duration: 10000,
  },
  prefix: 'EMAIL-TASK',
  defaultJobOptions: {
    attempts: 3,
    removeOnComplete: true,
  },
};

class EmailQueue {
  private queue: Queue.Queue;

  constructor() {
    this.queue = new Queue('Email Queue', REDIS_URL, queueOpts);

    this.queue.process('email_notification', async (emailJob, done) => {
      console.log('Processing email notification task');
      await sendEmail(emailJob);
      done();
    });
  }

  async addEmailToQueue(emailData: { name: string; email: string }) {
    await this.queue.add('email_notification', emailData);
    console.log('The email has been added to the queue...');
  }
}

export default EmailQueue;
