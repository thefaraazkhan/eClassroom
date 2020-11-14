const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user');
const Assignment = require('../models/assignment');
const check = require('../middleware/check');
const multer = require('multer');
const path = require('path')

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
        const assignments = await Assignment.find({});
        res.render('dash', {
            assignments
        });
    }else{
        res.render('t-dash');
    }
});

router.get('/aassignment/:id', async (req, res)=>{
    const assignment = await Assignment.findOne({_id: req.params.id});
    let fileName = assignment.fileURL.split('/')[2];
    res.render('assignment-details', {
        assignment,
        fileName
    });
});


router.post("/project/submit/:id", upload.single('file'), async (req, res)=>{
    await Assignment.findOneAndUpdate({_id: req.params.id}, {
        isCompleted: true,
        completedFile: '/uploads/' + req.file.filename,
        completedBy: req.user._id,
    });

    res.redirect('/dash');
});

module.exports = router;