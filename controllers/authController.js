var async = require('async')
var User = require('../models/user')

const { validationResult } = require("express-validator");

function getInfo(req, res) {
  User.findOne({ 'email': req.body.email }, function (err, user) {
    if (!user) return res.json({ message: 'Địa chỉ Email không tồn tại' });

    user.comparepassword(req.body.password, (err, isMatch) => {
      if (!isMatch) return res.json({ message: "Mật khẩu không chính xác" });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie('auth', user.token);
        return res.json({
          id: user._id,
          email: user.email,
          token: user.token
        });
      });
    });
  });
}

// Handle Author create on POST.
exports.register = function (req, res) {
  try {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array()[0].msg
      });
    }
    else {
      User.findOne({ email: req.body.email }, function (err, user) {
        if (user) return res.status(400).json({ message: "Địa chỉ Email đã tồn tại" });

        // Data from form is valid.
        // Create Author object with escaped and trimmed data
        var newuser = new User(req.body);
        // Save author.
        newuser.save(function (err, doc) {
          if (err) {
            console.log(err);
            return res.status(400).json({ message: "Đã xảy ra lỗi" });
          }

          return getInfo(req, res);
        });
      });

    }
  } catch (error) {
    return res.status(400).json({
      error: {
        message: error
      }
    });
  }
}


exports.login = function (req, res) {
  try {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array()[0].msg
      });
    }
    else {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        let token = req.headers.authorization.split(' ')[1];
        User.findByToken(token, (err, user) => {
          if (err) return res(err);
          if (user) return res.status(400).json({
            message: "Bạn đã đăng nhập"
          });
          else
            return getInfo(req, res);

        });
      }
    }
  } catch (error) {
    return res.status(400).json({
      error: {
        message: error
      }
    });
  }
}


exports.logout = function (req, res) {
  try {
    // Extract the validation errors from a request.
    req.user.deleteToken(req.token, (err, user) => {
      if (err) return res.status(400).send(err);
      res.sendStatus(200).json({
        message: "Đăng xuất thành công"
      });
    });
  } catch (error) {
    return res.status(400).json({
      error: {
        message: error
      }
    });
  }
}


