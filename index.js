var express = require('express');
var router = express.Router();
var passport = require('passport');
const bcrypt = require('bcrypt');
const db = require('../connection');
const isAuthenticated = require('../middlewares/isAuthentication');

/* GET home page. */
router.get('/', function (req, res, next) {
  const messages = req.flash('info');
  res.render('login', { messages: messages });
});



router.post('/login',
  passport.authenticate('local', { failureRedirect: '/', failureFlash: true }),
  function (req, res) {
    console.log("Logged in successfully");
    res.redirect('/profile');
  }
);

router.post('/', async (req, res, next) => {
    const data = req.body;
    console.log("Received data:", data);
  
    if (!data.name || !data.email || !data.password || !data.job_title) {
      req.flash('info', 'All fields are required.');
      return res.redirect('/signup');
    }
  
    try {
      const hashPassword = await bcrypt.hash(data.password, 10);
      const query = `INSERT INTO users (name, email, job_title, password) VALUES (?, ?, ?, ?)`;
      db.query(query, [data.name, data.email, data.job_title, hashPassword], (err) => {
        if (err) {
          console.error("Error inserting user:", err);
          req.flash('info', 'Registration failed. Please try again.');
          return res.redirect('/signup');
        }
        req.flash('info', 'You have registered successfully!');
        console.log("User registered successfully");
        res.redirect('/');
      });
    } catch (error) {
      console.error("Error during registration:", error);
      req.flash('info', 'An error occurred. Please try again.');
      res.redirect('/signup');
    }
  });
  
  router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Logout error:", err);
            return next(err);
        }
        req.flash('info', 'Logged out successfully');
        res.redirect('/');
    });
});


router.get('/signup', (req, res) => {
  res.render('signup');
});

router.use(isAuthenticated);

router.get('/profile', (req, res) => {
  res.render('profile', { user: req.user });
});

module.exports = router;
