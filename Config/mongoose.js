const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost/codeial_development');

const db=mongoose.connection;

db.on('error',console.log.bind(console, "Error connecting to MongoDB"));

db.once('open',function(){
    console.log("Connected to database MongoDB");
})

module.exports= db;