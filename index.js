const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const multer = require('multer');
const path = require('path');
const { Storage } = require('@google-cloud/storage');
const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());
app.use(cors());

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: path.join(__dirname, 'storageACKey', 'sakey.json'),
});

// Specify your GCS bucket name
const bucketName = 'shopper-bucket1';
const bucket = storage.bucket(bucketName);

// Image upload configuration using Multer
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

app.get("/", (req, res) => {
  res.send("Express app Running");
});

// Endpoint for uploading images to GCS
app.post("/upload", upload.single('product'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: 0, message: 'No image file provided' });
    }

    const filename = `${Date.now()}_${req.file.originalname}`;
    const file = bucket.file(filename);

    // Create a writable stream to upload the file to GCS
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

    stream.on('finish', () => {
      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
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

// Your other routes and middleware
// app.use('/products', productRoute);
// app.use('/users', userRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const { Storage } = require('@google-cloud/storage');

const uploadDir = path.join(__dirname, './uploads');
router.use('/uploads', express.static(uploadDir));

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: path.join(__dirname, 'storageACKey', 'sakey.json'),
});
const bucket = storage.bucket('shopper-bucket1'); // Replace with your bucket name
const upload = multer({ dest: uploadDir }); // Update destination to use the absolute path

router.post('/upload', protectedResource, upload.single('product'), async (req, res) => {
  console.log('inside route');
  const { productName, productPrice, productDescription } = req.body;

  if (!productName || !productPrice || !productDescription) {
    console.log('Missing fields');
    return res.status(400).json({ message: 'One or more fields are empty' });
  }

  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const filePath = path.join(uploadDir, file.filename);

    // Upload the file to Google Cloud Storage
    const remoteFileName = `${Date.now()}_${file.originalname}`;
    const remoteFile = bucket.file(remoteFileName);

    console.log('after file upload gc');

    fs.createReadStream(filePath)
      .pipe(remoteFile.createWriteStream())
      .on('error', (err) => {
        console.error(err);
        return res.status(500).json({ message: 'Error uploading file. Please try again.' });
      })
      .on('finish', async () => {
        // Delete the local file after successful upload
        fs.unlinkSync(filePath);

        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${remoteFileName}`;

        // Save product information to the database
        const productObj = new ProductModel({
          productName,
          productPrice,
          productDescription,
          product: publicUrl,
          cartQuantity: 1,
        });

        const newProduct = await productObj.save();
        console.log('Product added');
        res.status(201).json({ product: newProduct });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while adding the product' });
  }
});
router.post('/addfeatured', protectedResource, upload.single('product'), async (req, res) => {
  console.log('inside route');
  const { productName, productPrice, productDescription } = req.body;

  if (!productName || !productPrice || !productDescription) {
    console.log('Missing fields');
    return res.status(400).json({ message: 'One or more fields are empty' });
  }

  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const filePath = path.join(uploadDir, file.filename);

    // Upload the file to Google Cloud Storage
    const remoteFileName = `${Date.now()}_${file.originalname}`;
    const remoteFile = bucket.file(remoteFileName);

    console.log('after file upload gc');

    fs.createReadStream(filePath)
      .pipe(remoteFile.createWriteStream())
      .on('error', (err) => {
        console.error(err);
        return res.status(500).json({ message: 'Error uploading file. Please try again.' });
      })
      .on('finish', async () => {
        // Delete the local file after successful upload
        fs.unlinkSync(filePath);

        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${remoteFileName}`;

        // Save product information to the database
        const productObj = new FeaturedProductModel({
          productName,
          productPrice,
          productDescription,
          product: publicUrl,
          cartQuantity: 1,
        });

        const newProduct = await productObj.save();
        console.log('Product added');
        res.status(201).json({ product: newProduct });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while adding the product' });
  }
});

