const _ = require('lodash');
const { User } = require('../models/user');
const express = require('express');
const router = express();
const ensureAuthenticated = require('../middleware/auth')

// Home Page Route
router.get('/', ensureAuthenticated, async (req, res) => {
    res.render('homePage', {user: req.user})
})


module.exports = router;