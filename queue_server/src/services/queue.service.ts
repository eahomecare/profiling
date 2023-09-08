// QueueServices.ts
import Queue from 'bull';

const REDIS_URL = 'redis://127.0.0.1:6379';

interface QueueServiceOptions {
    limiter: Queue.QueueOptions['limiter'];
    prefix: string;
    defaultJobOptions: Queue.QueueOptions['defaultJobOptions'];
}

class QueueServices {
    private emailQueue: Queue.Queue;

    constructor(options: QueueServiceOptions) {
        this.emailQueue = new Queue('Email Queue', REDIS_URL, {
            limiter: options.limiter,
            prefix: options.prefix,
            defaultJobOptions: options.defaultJobOptions,
        });
    }

    async addToQueue(queueName: string, data: any, delay?: number): Promise<Queue.Job> {
        let job: Queue.Job;
        if (delay) {
            job = await this.emailQueue.add(queueName, data, { delay });
        } else {
            job = await this.emailQueue.add(queueName, data);
        }
        return job;
    }
    async processQueue(queueName: string, handler: Queue.ProcessCallbackFunction<any>) {
        this.emailQueue.process(queueName, handler);
    }
}

export default QueueServices;
