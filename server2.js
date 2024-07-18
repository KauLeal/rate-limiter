const express = require('express');
const slidingWindowCounterRedis = require('./slidingWindowCounterRedis');

const app = express();
const port = 3002;

app.use(slidingWindowCounterRedis);

app.get('/', (req, res) => {
  res.send('Hello from Server 2');
});

app.listen(port, () => {
  console.log(`Server 2 listening at http://localhost:${port}`);
});
