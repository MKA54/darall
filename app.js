var createError = require('http-errors');
var express = require('express');
var formData = require('express-form-data');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var bodyParser = require('body-parser');

var authRouter = require('./routes/auth');
var indexRouter = require('./routes/index');
var addDishRouter = require('./routes/add');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(formData.parse());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var requireAuth = (req, res, next) => {
  //token
  if (req.user) {
    next();
  } else {
    res.render('login', {
      message: 'Please login to continue',
      messageClass: 'alert-danger'
    });
  }
};

app.post('/register', authRouter);
app.post('/login', authRouter);
app.get('/auth', authRouter);
app.get('/register', authRouter);
app.get('/login', authRouter);

app.use('/', indexRouter);
app.use('/api/updateDish', indexRouter);
app.use('/dish', requireAuth, addDishRouter);
app.use('/api/createDish',   addDishRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
