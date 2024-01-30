const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const multer = require('multer');
const path = require('path');
const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: path.join(__dirname, 'storageACKey/sakey.json'), // Replace with the path to your service account key file
});

const bucket = storage.bucket('shopper-bucket1'); // Replace with your bucket name

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Express app Running');
});

app.use('/images', express.static('upload/images'));

app.post('/upload', upload.single('product'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: 0, message: 'No image file provided' });
    }

    const filename = `${req.file.fieldname}_${Date.now()}${path.extname(req.file.originalname)}`;
    const file = bucket.file(filename);
    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
      resumable: false,
    });

    stream.on('error', (err) => {
      console.error('Error uploading to GCS:', err);
      res.status(500).json({ success: 0, message: 'Internal server error' });
    });

    stream.on('finish', async () => {
      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
      res.json({
        success: 1,
        image_url: imageUrl,
      });
    });

    stream.end(req.file.buffer);
  } catch (error) {
    console.error('Error during image upload:', error);
    res.status(500).json({ success: 0, message: 'Internal server error' });
  }
});

app.listen(PORT, (error) => {
  if (error) {
    console.log('Error ', error);
  }
  console.log(`Server Running on port ${PORT}`);
});
