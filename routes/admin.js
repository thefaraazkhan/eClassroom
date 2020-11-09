const router = require('express').Router();
const { response } = require('express');
const passport = require('passport');
const Assignment = require('../models/assignment');
const User = require('../models/user');
const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})

const upload = multer({ storage: storage });

router.get('/addproject', (req, res)=>{
    res.render("add-project")
});


router.post('/addproject', upload.single('file') ,async (req, res)=>{


        await Assignment.create({
            title: req.body.title,
            details: req.body.detail,
            fileURL: '/uploads/' + req.file.filename,
            marks: req.body.mark,
            dueDate: new Date(req.body.due_date),
            createdBy: req.user._id,
        });
        res.send('file uploaded');
});

module.exports = router;