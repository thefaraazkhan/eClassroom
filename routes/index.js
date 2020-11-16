const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user');
const Assignment = require('../models/assignment');
const CompletedAssignment = require('../models/completed-assignment');
const check = require('../middleware/check');
const multer = require('multer');
const path = require('path');
const assignment = require('../models/assignment');
const completedAssignment = require('../models/completed-assignment');
const mongoose = require("mongoose");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
});

const upload = multer({ storage: storage });
router.get('/',check.isGuest ,(req, res)=>{
    res.render('home');
});

router.get('/register', check.isGuest ,(req, res)=>{
    res.render('register');
});

router.get('/login', check.isGuest ,(req, res)=>{
    res.render('login');
});

router.post('/register',(req, res)=>{
    
    const { firstName, lastName, username, password, type } = req.body;
    const NewUser = new User({
        username,
        firstName,
        lastName,
        type
    });

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

router.get('/dash', check.isLoggedin ,async (req, res)=>{

    if(req.user.type === 'student'){
        const completedAssignments = await CompletedAssignment.find({completedBy: req.user._id}).populate("parentAssignment").exec();
        

        let ids = completedAssignments.map((ca)=>{
            return `${ca.parentAssignment._id}`;
        });

        let pendingAssignments = await Assignment.find({_id: {$nin: ids}});
        res.render('dash', {
            completedAssignments,
            pendingAssignments
        });
    }else{
        res.render('t-dash');
    }
});

router.get('/aassignment/:id', async (req, res)=>{
    const assignment = await Assignment.findOne({_id: req.params.id});
    let fileName = assignment.fileURL.split('/')[2];

    const completedAssignment = await CompletedAssignment.findOne({parentAssignment: assignment._id});
    let isSubmitted = false;

    if(completedAssignment){
        isSubmitted = true;
    }

    res.render('assignment-details', {
        assignment,
        fileName,
        isSubmitted,
        completedAssignment
    });
});


router.post("/project/submit/:id", upload.single('file'), async (req, res)=>{

    let teacherId = await Assignment.findOne({_id: req.params.id});

    await CompletedAssignment.create({
        parentAssignment: req.params.id,
        createdBy: teacherId.createdBy,
        completedFile: '/uploads/' + req.file.filename,
        completedBy: req.user._id,
    });

    res.redirect('/dash');
});

module.exports = router;