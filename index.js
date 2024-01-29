const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const multer = require('multer');
const path = require('path');
const cors = require("cors");
const dotenv = require('dotenv');
const { Storage } = require('@google-cloud/storage');

dotenv.config();
const db = require('./config/db.js');
const productRoute = require('./routes/product.js');
const userRoutes = require('./routes/user.js');
const cartRoute = require('./routes/cart.js');

// Create a new instance of the Storage class
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: path.join(__dirname, './storageACKey/sakey.json'), // Replace with the path to your service account key file
});

// Get a reference to the bucket
const bucket = storage.bucket('shopperbucket'); // Replace with your bucket name

// Request will be automatically parsed through JSON
app.use(express.json());
app.use(cors());

// APIs
app.get("/", (req, res) => {
  res.send("Express app Running");
});

// Image Storing ENGINE using multer
// Configuration
const multerStorage = multer.memoryStorage(); // Store images in memory for uploading to GCS
const upload = multer({ storage: multerStorage });

// Creating upload endpoint for images
app.post("/upload", upload.single('product'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: 0, message: 'No image file provided' });
    }

    // Get a unique filename for the image
    const filename = `${req.file.fieldname}_${Date.now()}${path.extname(req.file.originalname)}`;

    // Create a stream to upload the image to the bucket
    const file = bucket.file(filename);
    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
      resumable: false,
    });

    // Handle errors during the upload
    stream.on('error', (err) => {
      console.error('Error uploading to GCS:', err);
      res.status(500).json({ success: 0, message: 'Internal server error during image upload' });
    });

    // Handle the finish event after the image is uploaded successfully
    stream.on('finish', async () => {
      // Get the public URL of the uploaded image
      const imageUrl = `https://storage.googleapis.com/${shopperbucket}/${file.name}`;

      // Send the success response with the image URL
      res.json({
        success: 1,
        image_url: imageUrl,
      });
    });

    // Write the image data to the stream
    stream.end(req.file.buffer);
  } catch (error) {
    console.error('Error during image upload:', error);
    res.status(500).json({ success: 0, message: 'Internal server error during image upload' });
  }
});

// Create product route
app.use(productRoute);
// Other APIs
app.use(userRoutes);
app.use(cartRoute);

app.listen(PORT, (error) => {
  if (error) {
    console.log('Error ', error);
  }
  console.log(`Server Running on port ${PORT}`);
});
