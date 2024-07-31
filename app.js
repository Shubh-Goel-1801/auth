var express = require('express');
var flash = require('connect-flash');
var session = require('express-session');
const passport = require('passport');

const localStrategy = require('./middlewares/local.strategy');
var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var addressRouter = require('./routes/addresses.js');


var app = express();
app.set('view engine', 'ejs');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));

app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(localStrategy);

app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/addresses', addressRouter);

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});
