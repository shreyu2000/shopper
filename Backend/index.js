const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const multer = require('multer');
const path = require('path');
const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config();
const db = require('./config/db.js');
const productRoute = require('./routes/product.js');
const userRoutes = require('./routes/user.js');
const cartRoute =require('./routes/cart.js')

//request willbe automatically parsed through json
app.use(express.json());
app.use(cors());


//apis
app.get("/",(req,res)=>{
    res.send("Express app  Running");
})


//Image Storing ENGINE use multer 
//configuration 
const storage = multer.diskStorage({
    destination:"./upload/images",
    filename:(req ,file ,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer ({storage:storage})

//creating upload endpoint for images 
app.use('/images' , express.static('upload/images'));
app.post("/upload" ,upload.single('product') ,(req,res)=>{
    res.json({
        success:1,
        image_url :`http://localhost:${PORT}/images/${req.file.filename}`,

    })
})


//createproduct route
app.use(productRoute);

//other apis 
app.use(userRoutes);
app.use(cartRoute);


app.listen(PORT ,(error)=>{
    if(error){
        console.log('Error ' ,error)
    }
    console.log(`Server Running on port ${PORT}`)
})
