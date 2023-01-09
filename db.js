const mongoose = require("mongoose");
require("dotenv").config();

const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/assignmentEval";

// async function connectdb() {
//   await mongoose.connect(DB_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//     useCreateIndex: true,
//   });

//   console.log("database connected");
// }
// connectdb();

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO MONGO CONNECTION ERROR!!!!");
    console.log(err);
  });

module.exports = mongoose;
