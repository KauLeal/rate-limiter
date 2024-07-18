const express = require('express');
const slidingWindowCounterRedis = require('./slidingWindowCounterRedis');

const app = express();
const port = 3001;

app.use(slidingWindowCounterRedis);

app.get('/', (req, res) => {
  res.send('Hello from Server 1');
});

app.listen(port, () => {
  console.log(`Server 1 listening at http://localhost:${port}`);
});
