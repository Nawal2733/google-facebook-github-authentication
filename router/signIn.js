const Joi = require('joi');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const {
    User
} = require('../models/user');
const express = require('express');
const router = express();



// ==== Passport Local ===============
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {

    const user = await User.findOne({
        email: email
    });
    if (!user) return done(null, false, "Invailed User Name...!!!!");
    const validePassword = await bcrypt.compare(password, user.password);
    if (!validePassword) return done(null, false, "Invalid Password...!!!");
    return done(null, user)

}));

// serialize and Deserialize
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// SignIn Page Route
router
    .route('/')
    .get(async (req, res, next) => {
        res.render('signIn')
    })
    .post(async (req, res, next) => {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // ============ passport =================
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/users/signIn',
        })(req, res, next);
    })

function validate(user) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    };
    return Joi.validate(user, schema);
}


module.exports = router;