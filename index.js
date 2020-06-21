const express = require('express');
const port = 8000;
const app =express();
const expressLayouts = require('express-ejs-layouts');

//use layouts
app.use(expressLayouts);

//use Express Router
app.use('/',require('./Routes'));

//setup view engine
app.set('view engine','ejs');
app.set('views','./Views');

app.listen(port,function(err){
    if(err){
        console.log(`There is error in running the server: ${err}` );
    }

    console.log(`My server is running up and good on port: ${port}`);
})