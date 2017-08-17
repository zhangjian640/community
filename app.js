const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const Errors = require('./errors');
const index = require('./routes/index');
const user = require('./routes/user');
const topicRouter = require('./routes/topic');

const app = express();

require('./services/mongoose_service');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/user', user);
app.use('/topic', topicRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  
  if (err instanceof Errors.BaseHTTPError) {
    res.statusCode = err.httpCode;
    res.json({
      code: err.OPCode,
      msg: err.httpMsg
    });
  } else {
    res.statusCode = 500;
    res.json({
      code: Errors.BaseHTTPError.DEFAULT_OPCODE,
      msg: '服务器出错啦'
    });
  }
  console.log(err)
});

module.exports = app;
