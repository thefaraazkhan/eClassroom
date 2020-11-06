const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/', (req, res)=>{
    res.render('home');
});

router.get('/register', (req, res)=>{
    res.render('register');
});

router.get('/login', (req, res)=>{
    res.render('login');
});

router.post('/register', (req, res)=>{
    
    const { firstName, lastName, username, password, type } = req.body;
    const NewUser = new User({
        username,
        firstName,
        lastName,
        type
    })
    User.register(NewUser, req.body.password, (err, user)=>{
        if(err){
            console.log(err);
            res.redirect('/register');
            return;
        }
        res.redirect('/login');
    });
});


router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login' 
  }), (req, res)=>{
      res.redirect('/dash');
});

router.get('/logout', (req, res)=>{
      req.logOut();
      req.logout();
      res.redirect('/');
});

router.get('/dash', (req, res)=>{
    res.render('t-dash');
})

module.exports = router;