const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world!'
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // try {
    cb(null, 'uploads');
    // } catch(e) {
      // console.log(e);
    // }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }
});

app.post('/cv/create', upload.single('headshotImage'), async (req, res) => {
    // console.log('POST Request to /cv/create');
    const {
      fullName,
      currentPosition,
      currentLength,
      currentTechnologies,
      workHistory
    } = req.body;
    res.json({
      message: 'Request successful!',
      data: {},
    });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
