const Queue = require('bull');
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const queue = new Queue('queue', REDIS_URL);

module.exports = queue;
