const express = require('express');
const _ = require('lodash')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('../config/keys');
const { User } = require('../models/user')

const router = express.Router();


passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/googleAuth/callback',
}, async (token, tokenSecret, profile, done) => {

    let user = await User.findOne({ provider_id: profile.id });
    if (user) return done(null, user);

    // Save New User
    user = new User({
        provider_id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        password: '',
        photo: profile.photos[0].value,
        profileUrl: '',
        provider: profile.provider
    });
    user.save();
    // console.log(user)
    return done(null, user)
   
}));

router.get('/',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

router.get('/callback',
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/users/signIn',
    })
);

module.exports = router;