const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/addproject', (req, res)=>{
    res.render('home');
});

module.exports = router;