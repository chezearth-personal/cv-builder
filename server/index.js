const express = require('express');
// import * as express from 'express';
const cors = require('cors');
// import * as cors from 'cors';
const multer = require('multer');
const path = require('path');

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

app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalName));
  }
});
const upload = multer({
  storage: storage,
  limits: { filesize: 1024 * 1024 * 5 }
});
