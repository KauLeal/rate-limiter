const express = require('express');
const slidingWindowCounterRedis = require('./slidingWindowCounterRedis');

const app = express();
const port = 3002;

app.use(slidingWindowCounterRedis);

app.get('/', (req, res) => {
  res.send('Servidor 2 funcionando!');
});

app.listen(port, () => {
  console.log(`Servidor 2 ouvindo em http://localhost:${port}`);
});
