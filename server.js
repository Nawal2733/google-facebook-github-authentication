const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const port = process.env.PORT || 4000;
const app = express();

// connect mongoose
mongoose.connect('mongodb://localhost:27017/socialAuth', {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(() => console.log("Connected to database ....."))
    .catch(err => console.log("Could Not Connect to Mongodb...!!!"))

// Body parser config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Static Path
app.use(express.static(path.join(__dirname + '/public')));

// views engin and views path config
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'hbs');

// session
app.use(session({
    secret: "SocialAuth",
    saveUninitialized: true,
    resave: true
}));

// init passport
app.use(passport.initialize());
app.use(passport.session());

// route config
const homeRoute = require('./router/home');
const signUpRoute = require('./router/signUp');
const signInRoute = require('./router/signIn');
const googleAuth = require('./router/googleAuth');
const facebookAuth = require('./router/facebookAuth');
const githubAuth = require('./router/githubAuth');
const logout = require('./router/logout');

app.use('/', homeRoute);
app.use('/users/signUp', signUpRoute);
app.use('/users/signIn', signInRoute);
app.use('/googleAuth', googleAuth);
app.use('/facebookAuth', facebookAuth);
app.use('/githubAuth', githubAuth);
app.use('/logout', logout);

// server start 
app.listen(port, () => {
    console.log(`Server Start At port ${port}`)
});