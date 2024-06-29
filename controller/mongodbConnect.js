const mongoose = require('mongoose')
const URI = 'mongodb+srv://kgsandeep911:sandeepkg111@cluster0.re3lnjq.mongodb.net/taskManager'
async function  dbconnect(req,res) {
   try{
    await mongoose.connect(URI, {
        serverSelectionTimeoutMS: 3000,
        useNewUrlParser: true,
        useUnifiedTopology: true
      
    })
        .then(() => {
            console.log('mongodb connected');
        },
            err => { console.log("mongodb connection error:", err); }
        );
   }catch(err){
    console.log("err1:",err);
   }
  
}
module.exports = { dbconnect }