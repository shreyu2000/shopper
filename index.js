const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const multer = require('multer');
const path = require('path');
const cors = require("cors");
const dotenv = require('dotenv');
const { Storage } = require('@google-cloud/storage'); // Import Google Cloud Storage SDK
dotenv.config();
const db = require('./config/db.js');
const productRoute = require('./routes/product.js');
const userRoutes = require('./routes/user.js');
const cartRoute = require('./routes/cart.js');

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: path.join(__dirname, '/storageACKey/sakey.json'),
});
const bucketName = process.env.GCS_BUCKET_NAME;

// Request will be automatically parsed through json
app.use(express.json());
app.use(cors());

// APIs
app.get("/",(req,res)=>{
    res.send("Express app  Running");
});

// Image Storing ENGINE using multer
// Configuration
const multerStorage = multer.memoryStorage(); // Use memory storage for uploading to GCS

const upload = multer ({storage: multerStorage});

// Creating upload endpoint for images
app.post("/upload" ,upload.single('product') , async (req,res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ success: 0, message: "No file uploaded." });
    }

    const bucket = storage.bucket(bucketName);
    const gcsFileName = `${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(gcsFileName);

    const stream = fileUpload.createWriteStream({
        metadata: {
            contentType: file.mimetype
        },
        resumable: false
    });

    stream.on('error', err => {
        console.error('Upload stream error:', err);
        return res.status(500).json({ success: 0, message: "Failed to upload file." });
    });

    stream.on('finish', () => {
        const imageUrl = `https://storage.googleapis.com/${bucketName}/${gcsFileName}`;
        res.json({ success: 1, image_url: imageUrl });
    });

    stream.end(file.buffer);
});

// Create product route
app.use(productRoute);

// Other APIs 
app.use(userRoutes);
app.use(cartRoute);

app.listen(PORT ,(error) => {
    if(error){
        console.log('Error ' ,error);
    }
    console.log(`Server Running on port ${PORT}`);
});
