// queueHandler.js
const Queue = require('bull');

// use a real email handler module here - this is just an example
const sendEmail = require('./emailHandler.js');

// define constants, Redis URL, and queue options
const REDIS_URL = 'redis://127.0.0.1:6379';

const queueOpts = {
    // rate limiter options to avoid overloading the queue
    limiter: {
        // maximum number of tasks queue can take
        max: 100,

        // time to wait in milliseconds before accepting new jobs after
        // reaching limit
        duration: 10000
    },
    prefix: 'EMAIL-TASK', // a prefix to be added to all queue keys
    defaultJobOptions: { // default options for tasks in the queue
        attempts: 3, // default number of times to retry a task

        // to remove a task from the queue after completion
        removeOnComplete: true
    }
};

class EmailQueue {
    constructor() {
        this.queue = new Queue('Email Queue', REDIS_URL, queueOpts);

        // consumer function that takes in the assigned name of the task and
        // a callback function
        this.queue.process('email_notification', async (emailJob, done) => {
            console.log('processing email notification task');
            await sendEmail(emailJob); // send the email
            done(); // complete the task
        })
    }

    // producer function to add emails to queue
    async addEmailToQueue(emailData) {
        // add task with name 'email_notification' to queue
        await this.queue.add('email_notification', emailData);
        console.log('the email has been added to the queue...');
    }


};

module.exports = EmailQueue;