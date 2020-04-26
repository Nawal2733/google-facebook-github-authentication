// const express = require('express');

module.exports = function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/users/signIn');
    }
}