import express from 'express';
import bodyParser from 'body-parser';
import EmailQueue from './queueHandler';

const app = express();

app.use(bodyParser.json());

app.post('/email', async (req, res) => {
  const { name, email } = req.body;
  const emailQueue = new EmailQueue();
  await emailQueue.addEmailToQueue({ name, email });

  res.send('done');
});

app.listen(5001, () => console.log('Started queue server on port 5001'));
