const express = require('express');
// import * as express from 'express';
const cors = require('cors');
// import * as cors from 'cors';
const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json);
app.use(cors());
app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world!'
  });
});
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
