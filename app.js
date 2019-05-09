var createError = require('http-errors');
var express = require('express');
var apiRouter = require('./routes/api');

var app = express();

app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use((req, res, next)=> {
  next(createError(404));
});

// error handler
app.use((err, res)=> {
// send the error response
res.status(err.status).json('Error: ');
});

module.exports = app;
