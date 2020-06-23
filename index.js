const express = require('express');
const cookieParser = require('cookie-parser');
const port = 8000;
const app =express();
const expressLayouts = require('express-ejs-layouts');
const db=require('./config/mongoose');

//setting up middleware to read the post requests
app.use(express.urlencoded());

//setting up the cookie-parser middleware
app.use(cookieParser());

//linking the styling parts
app.use(express.static('./assets'));

//use layouts
app.use(expressLayouts);

//extract styles and script from the subpages to put into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

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