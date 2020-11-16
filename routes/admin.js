const router = require('express').Router();
const { response } = require('express');
const passport = require('passport');
const Assignment = require('../models/assignment');
const User = require('../models/user');
const multer = require('multer');
const path = require('path');
const CompletedAssignment = require('../models/completed-assignment');

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

router.get('/projects', async (req, res)=>{
  const assignments = await Assignment.find({createdBy: req.user._id});
  res.render("assigned-projects", {
    assignments,
  });
});

router.get("/submitted-projects", async (req, res)=>{
  const assignments = await CompletedAssignment.find({createdBy: req.user._id}).populate('parentAssignment completedBy').exec();

  function formatDate(date){
    let d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
  }

  res.render('submitted-projects', {
    assignments,
    formatDate
  });
});


router.get('/project/:id', async (req, res)=>{
  const assignment = await Assignment.findOne({_id: req.params.id});
  let fileName = assignment.fileURL.split('/')[2];
  res.render('t-project-detail', {
      assignment,
      fileName
  });
});


router.post('/addproject', upload.single('file') ,async (req, res)=>{


        await Assignment.create({
            title: req.body.title,
            details: req.body.detail,
            fileURL: '/uploads/' + req.file.filename,
            marks: Number(req.body.marks),
            dueDate: new Date(req.body.due_date),
            createdBy: req.user._id,
        });
        res.redirect('/dash');
});



router.post('/:id/givemarks', async (req, res)=>{

  await CompletedAssignment.findOneAndUpdate({_id: req.params.id}, {
    givenMarks: Number(req.body.marks)
  });
 
  res.redirect("/admin/submitted-projects");

});

module.exports = router;