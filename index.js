#!/usr/bin/env node

const express = require('express');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');
const db = require('./db');

function verify (username, password, done) {
  db.users.findByUsername(username, (err, user) => {
    if (err) { 
      return done(err)
    }

    if (!user) {
      return done(null, false)
    }

    if (!db.users.verifyPassword(user, password)) {
      return done(null, false)
    }

    return done(null, user)
  })
}

passport.use('local', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: false,
}, verify));

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  db.users.findById(id, (err, user) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  })
});

const errorMiddleware = require('./middleware/error');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(cors());
app.set('view engine', 'ejs');

app.use(expressSession({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/user', userRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`=== start server PORT ${PORT} ===`);
});
