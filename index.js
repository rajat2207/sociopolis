const express = require('express');
const port = 8000;

const app =express();

//use Express Router
app.use('/',require('./Routes'));

app.listen(port,function(err){
    if(err){
        console.log(`There is error in running the server: ${err}` );
    }

    console.log(`My server is running up and good on port: ${port}`);
})