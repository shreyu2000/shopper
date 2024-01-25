const mongoose =require('mongoose');
const dotenv =require('dotenv');
dotenv.config();

const db=mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
  console.log("DB Connected")
}).catch((err)=> {
  console.log("Failed to connect",err)
});


module.exports = db;