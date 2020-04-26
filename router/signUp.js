const _ = require('lodash');
// const jwt = require('jsonwebtoken');
// const config = require('config');
const bcrypt = require('bcrypt');
const {
    User,
    validate
} = require('../models/user');
const express = require('express');
const router = express();

// SignUp Page Route
router
    .route('/')
    .get(async (req, res) => {
        res.render('signUp')
    })
    .post(async (req, res) => {
        console.log(req.body);
        const {
            error
        } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let user = await User.findOne({
            email: req.body.email
        });
        if (user) return res.status(400).send('User already register..!!!');

        user = new User({
            provider_id: '',
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            photo: '',
            provider: 'local'
        });

        // bcrypt the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt)

        // Save user in database
        await user.save();
       
        // res.send("User Register")
        res.redirect('/')

    })


module.exports = router;