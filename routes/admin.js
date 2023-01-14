const router = require("express").Router();
// const { response } = require('express');
const passport = require("passport");
const Assignment = require("../models/assignment");
const User = require("../models/user");
const multer = require("multer");
const path = require("path");
const CompletedAssignment = require("../models/completed-assignment");

// ***************************************************

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
//   },
// });

// const upload = multer({ storage: storage });

// ***************************************************

// ********** Cloud Upload ***********
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ********** Cloud Upload ***********

router.get("/addproject", (req, res) => {
  res.render("add-project");
});

router.get("/projects", async (req, res) => {
  const assignments = await Assignment.find({ createdBy: req.user._id });
  res.render("assigned-projects", {
    assignments,
  });
});

router.get("/submitted-projects", async (req, res) => {
  const assignments = await CompletedAssignment.find({
    createdBy: req.user._id,
  })
    .populate("parentAssignment completedBy")
    .exec();

  function formatDate(date) {
    let d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }

  res.render("submitted-projects", {
    assignments,
    formatDate,
  });
});

router.get("/project/:id", async (req, res) => {
  const assignment = await Assignment.findOne({ _id: req.params.id });
  function formatDate(date) {
    let d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }
  let fileName = assignment.fileURL.split("/")[1];

  res.render("t-project-detail", {
    assignment,
    formatDate,
    fileName,
  });
});

router.get("/deleteprojects", async (req, res) => {
  const assignments = await Assignment.find({ createdBy: req.user._id });
  res.render("delete-projects", {
    assignments,
  });
});

router.get("/project/:id/delete", async (req, res) => {
  await Assignment.findOneAndDelete({ _id: req.params.id });
  await CompletedAssignment.findOneAndDelete({
    parentAssignment: req.params.id,
  });
  res.redirect("/");
});

router.post("/addproject", upload.single("file"), async (req, res) => {
  // console.log("req.body", req.body);
  // console.log("req.file", req.file);

  // ****************************************************************
  const randomNum = Math.floor(Math.random() * 5000);
  const fileName = req.file.originalname.split(" ").join("");
  const randomImageName = `${randomNum}${req.user.firstName}-${fileName}`;
  console.log(randomImageName);

  // req.file.buffer is the actual image
  const params = {
    Bucket: bucketName,
    Key: randomImageName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  const command = await new PutObjectCommand(params);
  s3.send(command);

  const completedFileURL = "d31lyalmsd17xb.cloudfront.net/" + randomImageName;

  // ****************************************************************

  await Assignment.create({
    title: req.body.title,
    details: req.body.detail,
    fileURL: completedFileURL,
    marks: Number(req.body.marks),
    dueDate: new Date(req.body.due_date),
    createdBy: req.user._id,
  });
  res.redirect("/dash");
});

router.post("/:id/givemarks", async (req, res) => {
  await CompletedAssignment.findOneAndUpdate(
    { _id: req.params.id },
    {
      givenMarks: Number(req.body.marks),
    }
  );

  res.redirect("/admin/submitted-projects");
});

// router.get("/assignment-details", async (req, res)=>{

//   function formatDate(date){
//     let d = new Date(date);
//     return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
//   }

//   res.render('assignment-details', {
//     formatDate,
//   });
// });

module.exports = router;
