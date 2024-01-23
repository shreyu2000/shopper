const fs = require('fs')
const http = require('http')
const url =require('url')




const server =http.createServer((req,res)=>{
   const path= req.url;

   if(path === '/'){
    res.end('Server');
   }
})