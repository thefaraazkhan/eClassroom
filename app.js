require("dotenv").config();
const express = require("express");
const app = express();
const session = require("express-session");
const db = require("./db");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const LocalStrat = require("passport-local").Strategy;
const User = require("./models/user");
const check = require("./middleware/check");
const flash = require("connect-flash");

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    store: new MongoStore({ mongooseConnection: db.connection }),
  })
);

app.use(flash());

// auth configs
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrat(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.user = req.user || "";
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//routes

app.use("/", require("./routes/index"));
app.use("/admin", check.isLoggedin, check.isTeacher, require("./routes/admin"));

app.all("*", (req, res) => {
  res.render("error");
});

const PORT = process.env.PORT;

app.listen(PORT, () =>
  console.log(`Server started on http://localhost:${PORT}`)
);
