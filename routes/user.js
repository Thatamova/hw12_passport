const express = require('express');
const passport = require('passport')
const router = express.Router();
const db = require('../db');

router.get('/login', (req, res) => {
  res.render("user/login", {
    title: "Авторизуйтесь"
  });
});

router.post('/login',
  passport.authenticate(
    'local',
    { failureRedirect: '/user/login',
      successRedirect: '/',
    }
  )
);

router.get('/me',
  (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      if (req.session) {
        req.session.returnTo = req.originalUrl || req.url
      }
      return res.redirect('/user/login')
    }
    next();
  },
  (req, res) => {
    res.render("user/profile", {
      title: "Личный кабинет",
      user: req.user
    });
  }
);

router.post('/signup',
  (req, res, next) => {
    const {
      username,
      password,
      displayName
    } = req.body;

    db.users.addUser({username, password, displayName}, (e) => {
      if (e) {
        console.error(e);
        res.status(404).redirect('/404');
      }
      next();
    });
  },
  passport.authenticate(
    'local',
    { failureRedirect: '/user/login',
      successRedirect: '/',
    }
  )
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
