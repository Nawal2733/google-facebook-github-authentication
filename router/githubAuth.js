const express = require('express');
const passport = require('passport');
const keys = require('../config/keys');
const { User } = require('../models/user')
const GitHubStrategy = require('passport-github').Strategy;

const router = express.Router();

passport.use(new GitHubStrategy({
        clientID: keys.githubClientID,
        clientSecret: keys.githubClientSecret,
        callbackURL: "/githubAuth/auth/github/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        // console.log(profile)
        let user = await User.findOne({ provider_id: profile.id });
        if (user) return done(null, user);

        // Save New User
        user = new User({
            provider_id: profile.id,
            name: profile.displayName,
            email: ' ',
            password: ' ',
            photo: profile.photos[0].value,
            profileUrl: profile.profileUrl,
            provider: profile.provider
        });
        user.save();
        // console.log(user)
        return done(null, user)

    }
));

router.get('/',
    passport.authenticate('github')
);


router.get('/auth/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/users/signIn'
    }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    }
);

module.exports = router;