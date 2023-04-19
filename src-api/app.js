var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv').config();

var usersRouter = require('./routes/users');
var solvesRouter = require('./routes/solves');
var roomsRouter = require('./routes/rooms');
var partiesRouter = require('./routes/parties');
var cubesRouter = require('./routes/cubes');

var mongoose = require('mongoose');
mongoose.set('strictQuery', false);
console.log(process.env.DB_URI);
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true })
  .then(() => console.log('Mongoose connection successful!'))
  .catch((err) => console.error(err));

var db = mongoose.connection;
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/solves', solvesRouter);
app.use('/rooms', roomsRouter);
app.use('/parties', partiesRouter);
app.use('/cubes', cubesRouter);

module.exports = app;