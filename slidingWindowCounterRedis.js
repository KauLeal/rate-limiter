const redis = require('redis');
const moment = require('moment');

//Cliente Redis
const client = redis.createClient({
  url: 'redis://localhost:6379'
});

client.on('error', (err) => console.log('Redis Client Error', err));

client.connect();

const WINDOW_SIZE_IN_SECONDS = 60;
const MAX_REQUESTS = 60;

const rateLimiter = async (req, res, next) => {
  const ip = req.ip;
  const currentTimestamp = moment().unix().toString();

  try {
    const timestamps = await client.lRange(ip, 0, -1);

    const requestsInWindow = timestamps.filter(timestamp => {
      return currentTimestamp - timestamp < WINDOW_SIZE_IN_SECONDS;
    });

    if (requestsInWindow.length >= MAX_REQUESTS) {
      return res.status(429).send('Error 429: Too Many Requests');
    }

    await client.multi()
      .rPush(ip, currentTimestamp)
      .expire(ip, WINDOW_SIZE_IN_SECONDS)
      .exec();

    next();
  } catch (err) {
    console.error('Redis error:', err);
    return res.status(500).send('Internal Server Error');
  }
};

module.exports = rateLimiter;
