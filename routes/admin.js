const router = require('express').Router();
const { response } = require('express');
const passport = require('passport');
const Assignment = require('../models/assignment');
const User = require('../models/user');
const cloudinary = require('cloudinary').v2
const path = require('path');
cloudinary.config({ 
    cloud_name: 'dxl9keibc', 
    api_key: '111434914861974', 
    api_secret: 'JO3Vw8qpHgIe1StHGtQOEobx66Y' 
  });

router.get('/addproject', (req, res)=>{
    res.render("add-project")
});


router.post('/addproject', (req, res)=>{

    cloudinary.uploader.upload(req.files.file.tempFilePath,  { resource_type: "auto" }, function(error, result) { 
        if(error){
            console.log(error);
        }
        console.log(result);
        Assignment.create({
            title: req.body.title,
            details: req.body.detail,
            fileURL: result.url,
            marks: req.body.mark,
            dueDate: new Date(req.body.due_date),
            createdBy: req.user._id,
        });
     });    
});

module.exports = router;