const LocalStrategy = require('passport-local');
const db = require('../connection');
const bcrypt = require('bcrypt');
const passport = require('passport');

const localStrategy = new LocalStrategy({
  usernameField: 'email'
}, (email, password, done) => {
  console.log(email);
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, result) => {
    if (err) {
      console.log("Error while querying", err);
      done(err);
    } else {
      if (result.length) {
        let passwordIsSame = bcrypt.compareSync(password, result[0].password);
        if (passwordIsSame) {
          done(null, result[0]);
        } else {
          console.log("Password does not match");
          done(null, false, { message: 'Incorrect password' });
        }
      } else {
        console.log("User does not exist");
        done(null, false, { message: 'Incorrect email' });
      }
    }
  });
});

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  const sql = 'SELECT * FROM users WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      done(err);
    } else {
      if (result.length) {
        done(null, result[0]);
      } else {
        done(null, false);
      }
    }
  });
});

module.exports = localStrategy;
