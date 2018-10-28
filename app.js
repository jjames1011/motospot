var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/test", { useNewUrlParser: true });

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  var kittySchema = new mongoose.Schema({
    name: String
  });
  kittySchema.methods.speak = function() {
    var greeting = this.name ? "Meow name is " + this.name : "I don't have a name";
    console.log(greeting);
  }
  var Kitten = mongoose.model("Kitten", kittySchema);

  var whiskers = new Kitten({name: 'whiskers'});

  whiskers.save(function(err, whiskers) {
    if(err) return console.log(err);
    whiskers.speak();
  });


  Kitten.find(function(err, kittens) {
    if(err) return console.log(err);
    console.log(kittens);
    
  });
});

var indexRouter = require('./routes/index');

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
