import express from 'express';
import bodyParser from 'body-parser';
import EmailQueue from './services/email.service';
import QueueServices from './services/queue.service';
import UserService from './services/user.service';

const app = express();
const userService = new UserService(); // Instantiate the user service


const queueOpts = {
  limiter: {
    max: 100,
    duration: 10000,
  },
  prefix: 'EMAIL-TASK',
  defaultJobOptions: {
    attempts: 3,
    removeOnComplete: false,
  },
};

app.use(bodyParser.json());


app.post('/process', async (req, res) => {
  const { service_type, execution_type, payload } = req.body;

  if (service_type === "email") {
    const { email_details } = payload;
    const queueServices = new QueueServices(queueOpts);
    const emailQueue = new EmailQueue(queueServices);

    await emailQueue.addEmailToQueue(req.body);

    res.status(200).json({ message: 'Email task added to the queue.' });
  } else if (service_type === "sms") {
    //TODO
    // Handle SMS service here
    // Enqueue SMS task

    res.status(200).json({ message: 'SMS task added to the queue.' });
  } else {
    res.status(400).json({ message: 'Unsupported service_type.' });
  }
});


app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    await userService.createUser(username, email, password);
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "failed" });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const { token, user } = await userService.loginUser(username, password);
    res.status(200).json({ token, user });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "failed" });
  }
});


app.listen(5001, () => console.log('Started queue server on port 5001'));
