const express = require('express');
const app = express();
const session = require('express-session');
const db =  require('./db');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const LocalStrat = require('passport-local').Strategy;
const User = require('./models/user');


app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false},
  store: new MongoStore({ mongooseConnection: db.connection })
}));


// auth configs
app.use(passport.initialize()); 
app.use(passport.session()); 

passport.use(new LocalStrat(User.authenticate()));

passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 


//routes

app.use('/', require('./routes/index'));
app.use('/admin', require('./routes/admin'));



app.listen(3000);