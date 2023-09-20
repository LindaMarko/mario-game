const express = require('express');
const app = express();

app.use(express.static('./'));

app.use((req, res, next) => {
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://mario-game-8f7p5uvyw-lindamarko.vercel.app/'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const server = app.listen(8000, () => {
  const port = server.address().port;
  console.log(`App started on port ${port}`);
});
