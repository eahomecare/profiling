const express = require('express');
const bodyParser = require('body-parser');
const queue = require('./queue');
const EmailQueue = require("./queueHandler")

const app = express();


app.use(bodyParser.json());

app.post('/job', async (req, res) => {
  const { type, data } = req.body;

  const job = await queue.add(type, data);

  res.json({ id: job.id });
});

app.post('/email', async (req, res) => {
  const { name, email } = req.body;
  const emailQueue = new EmailQueue(); // Create an instance of EmailQueue
  await emailQueue.addEmailToQueue({ name, email }); // Call the method on the instance


  res.send("done")

})

app.listen(5001, () => console.log('started queue server on port 5001'));
