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

    async addToQueue(queueName: string, data: any, delay?: number) {
        if (delay) {
            await this.emailQueue.add(queueName, data, { delay });
        } else {
            await this.emailQueue.add(queueName, data);
        }
    }

    async processQueue(queueName: string, handler: Queue.ProcessCallbackFunction<any>) {
        this.emailQueue.process(queueName, handler);
    }
}

export default QueueServices;
