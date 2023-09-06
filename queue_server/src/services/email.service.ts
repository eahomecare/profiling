// emailQueue.ts
import sendEmail from '../handlers/email.handler';
import QueueServices from './queue.service';

class EmailQueue {
    private queueServices: QueueServices;

    constructor(queueServices: QueueServices) {
        this.queueServices = queueServices;

        this.queueServices.processQueue('email_notification', async (emailJob, done) => {
            console.log('Processing email notification task');
            await sendEmail(emailJob);
            done();
        });
    }

    async addEmailToQueue(emailData: { from: string; to: string; subject: string; text: string }) {
        await this.queueServices.addToQueue('email_notification', emailData);
        console.log('The email has been added to the queue...');
    }
}

export default EmailQueue;
