const express = require('express');
const passport = require('passport');
const keys = require('../config/keys');
const FacebookStrategy = require('passport-facebook');
const { User } = require('../models/user')

const router = express.Router();

passport.use(new FacebookStrategy({
        clientID: keys.faceBookAppId,
        clientSecret: keys.faceBookAppSecret,
        callbackURL: "/facebookAuth/auth/facebook/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        // console.log(profile)

        let user = await User.findOne({ provider_id: profile.id });
        if (user) return done(null, user);

        // Save New User
        user = new User({
            provider_id: profile.id,
            name: profile.displayName,
            email: '',
            password: '',
            photo: '',
            profileUrl: '',
            provider: profile.provider
        });
        user.save();
        return done(null, user)


    }
));

router.get('/',
    passport.authenticate('facebook',{
        scope: ['email', 'user_friends']
    })
);

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/users/signIn'
    })
);


module.exports = router;