const express = require('express');
const slidingWindowCounterRedis = require('./slidingWindowCounterRedis');

const app = express();
const port = 3001;

app.use(slidingWindowCounterRedis);

app.get('/', (req, res) => {
  res.send('Servidor 1 funcionando!');
});

app.listen(port, () => {
  console.log(`Servidor 1 ouvindo em http://localhost:${port}`);
});
