const router = require("express").Router();
const passport = require("passport");
const User = require("../models/user");
const Assignment = require("../models/assignment");
const CompletedAssignment = require("../models/completed-assignment");
const check = require("../middleware/check");
const multer = require("multer");
const path = require("path");
const assignment = require("../models/assignment");
const completedAssignment = require("../models/completed-assignment");
const mongoose = require("mongoose");

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

// delete this: not needed
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

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

router.get("/", check.isGuest, (req, res) => {
  res.render("home");
});

router.get("/register", check.isGuest, (req, res) => {
  res.render("register");
});

router.get("/login", check.isGuest, (req, res) => {
  res.render("login");
});

router.post("/register", (req, res) => {
  const { firstName, lastName, username, password, type } = req.body;
  const NewUser = new User({
    username,
    firstName,
    lastName,
    type,
  });

  User.register(NewUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      res.redirect("/register");
      return;
    }
    res.redirect("/login");
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect("/dash");
  }
);

router.get("/logout", (req, res) => {
  req.logOut();
  req.logout();
  res.redirect("/");
});

router.get("/dash", check.isLoggedin, async (req, res) => {
  if (req.user.type === "student") {
    const completedAssignments = await CompletedAssignment.find({
      completedBy: req.user._id,
    })
      .populate("parentAssignment")
      .exec();

    let ids = completedAssignments.map((ca) => {
      return `${ca.parentAssignment._id}`;
    });

    let pendingAssignments = await Assignment.find({ _id: { $nin: ids } });
    res.render("dash", {
      completedAssignments,
      pendingAssignments,
    });
  } else {
    res.render("t-dash");
  }
});

router.get("/aassignment/:id", async (req, res) => {
  const assignment = await Assignment.findOne({ _id: req.params.id });

  // console.log(assignment);
  let fileName = assignment.fileURL.split("/")[1];

  const completedAssignment = await CompletedAssignment.findOne({
    parentAssignment: assignment._id,
  });
  let isSubmitted = false;
  // console.log(completedAssignment);

  if (completedAssignment) {
    isSubmitted = true;
  }
  function formatDate(date) {
    let d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }
  res.render("assignment-details", {
    assignment,
    fileName,
    formatDate,
    isSubmitted,
    completedAssignment,
  });
});

router.post("/project/submit/:id", upload.single("file"), async (req, res) => {
  // console.log("req.body", req.body);
  // console.log("req.file", req.file);

  let teacherId = await Assignment.findOne({ _id: req.params.id });

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

  await CompletedAssignment.create({
    parentAssignment: req.params.id,
    createdBy: teacherId.createdBy,
    completedFile: completedFileURL,
    completedBy: req.user._id,
  });

  res.redirect("/dash");
});

module.exports = router;
