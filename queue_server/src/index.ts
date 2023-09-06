import express from 'express';
import bodyParser from 'body-parser';
import EmailQueue from './services/email.service';
import QueueServices from './services/queue.service';


const app = express();

const queueOpts = {
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

app.use(bodyParser.json());

app.post('/email', async (req, res) => {
  const { name, email } = req.body;
  const queueServices = new QueueServices(queueOpts);
  const emailQueue = new EmailQueue(queueServices);
  await emailQueue.addEmailToQueue({ name, email });

  res.send('done');
});

app.listen(5001, () => console.log('Started queue server on port 5001'));
