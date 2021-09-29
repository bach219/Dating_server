const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const http = require('http');

// const multer = require('multer');
// const upload = multer();
const db = require('./config/config').get();
const datingRouter = require('./routes/dating');
const app = express();
let server = http.createServer(app);
let io = require('socket.io')(server);
let socket = require('./config/socket_connect').socket_connect;

global.__basedir = __dirname;

// database connection
mongoose.Promise = global.Promise;
mongoose.connect(db.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
  if (err) console.log(err);
  console.log("database is connected");
});

// for parsing multipart/form-data
// app.use(upload.array());

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use('/api/user/image', express.static('public/images'));


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use('/', datingRouter);

// catch 404 and forward to error handler
app.use(function (req, res) {
  return res.status(400).json({
    message: "Đường dẫn không tồn tại"
  });
});

socket(io);

module.exports = app;
