const queue = require('./queue');

queue.process('immediateJob', async (job, done) => {
  // implement logic to process the immediateJob
  console.log(job);
  done();
});

// Repeat for other job types: delayedJob, recurrentJob, priorityJob, limitedAttemptJob

queue.on('completed', (job, result) => {
  console.log(`Job completed with result ${result}`);
});

queue.on('failed', (job, err) => {
  console.log(`Job failed with error ${err.message}`);
});
