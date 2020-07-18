const express = require('express');
const cookieParser = require('cookie-parser');
const port = 8000;
const app =express();
const expressLayouts = require('express-ejs-layouts');
const db=require('./config/mongoose');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT=require('./Config/passport-jwt-strategy');
const passportGoogle=require('./Config/passport-google-oauth2-strategy');
const MongoStore=require('connect-mongo')(session);
//setting up sass middleware
const sassMiddleware= require('node-sass-middleware');
const flash=require('connect-flash');
const customMWare= require('./Config/middleware');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

//setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets=require('./Config/chat_sockets').chatSockets(chatServer); 
chatServer.listen(5000);
console.log("chat server is listening on port 5000")

app.use(sassMiddleware({
    /* Options */
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix:  '/css'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));

//setting up middleware to read the post requests
app.use(express.urlencoded());

//setting up the cookie-parser middleware
app.use(cookieParser());

//linking the styling parts
app.use(express.static('./assets'));

//make the upload path available to the browser
app.use('/uploads',express.static('./uploads'));

//use layouts
app.use(expressLayouts);

//extract styles and script from the subpages to put into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);



//setup view engine
app.set('view engine','ejs');
app.set('views','./Views');

//mongo store is used to store the session cookie in the db
app.use(session({
    name: 'sociopolis',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore(
        {
        mongooseConnection: db,
        autoRemove: 'disabled'
        },
        function(err){
            console.log(err || 'connect mongodb-store ok')
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//setup flash messages
app.use(flash());
app.use(customMWare.setFlash);

//use Express Router
app.use('/',require('./Routes'));

app.listen(port,function(err){
    if(err){
        console.log(`There is error in running the server: ${err}` );
    }

    console.log(`My server is running up and good on port: ${port}`);
})