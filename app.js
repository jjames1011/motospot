var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//db
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/28015");

//create database var for methods
var db = mongoose.connection;
//Error handler for db
db.on("error", (err) => {
  console.log("connection error:", err);
});
//open connection
db.once("open", () => {
  console.log("db connection successful");
});

var indexRouter = require('./routes/index');
//Will not need userRouter but keep for reference
// var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

//Shouldnt need app.use('/users', userRouter) but keep here for reference
// app.use('/users', usersRouter);

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
