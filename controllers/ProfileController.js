var User = require('../models/user')
var Photo = require('../models/photo')
const uploadFile = require("../middlewares/upload");
const fs = require('fs')
const response = require('../config/response');
const _ = require('lodash')
const async = require('async')

const { validationResult } = require("express-validator");

exports.profile = function (req, res) {
  try {
    const user_id = req.userData.sub;
    // let body = _.pick(req.body, ['email', 'password', 'name', 'sex', 'preferSex', 'interests', 'birth']);
    // return res.status(200).json(user_id);
    const user = req.body
    // {
    //   sex: req.body.sex,
    //   preferSex: req.body.preferSex,
    //   birth: req.body.birth,
    //   interests: req.body.interests,
    // };

    User.findByIdAndUpdate(user_id, user,
      {
        new: true
      },
      function (err, updatedUser) {
        if (err) {
          return res.status(response.STATUS_NOT_FOUND).json(
            response.createResponse(response.ERROR, 'Đã xảy ra lỗi: ' + err)
          );
        }
        // Successful - redirect to genre detail page.
        return res.status(response.STATUS_OK).json(
          response.createResponse(response.SUCCESS, 'Cập nhật dữ liệu cá nhân thành công', {
            user: updatedUser
          })
        );
      });

  } catch (err) {
    return res.status(response.STATUS_NOT_FOUND).json(
      response.createResponse(response.FAILED, 'Đã xảy ra lỗi: ' + err)
    );
  }
}

exports.get_profile = async function (req, res) {
  try {
    const user_id = req.userData.sub;

    // async.parallel({
    //   photos: function (callback) {
    //     Photo.find({ user: user_id }).exec(callback)
    //   },
    //   user: function (callback) {
    //     User.find({ _id: user_id }).exec(callback)
    //   },
    // }, function (err, results) {
    //   if (err) {
    //     console.log(err);
    //     return res.status(response.STATUS_NOT_FOUND).json(
    //       response.createResponse(response.ERROR, 'Đã xảy ra lỗi: ' + err)
    //     );
    //   }
    //   // Successful, so render.
    //   return res.status(response.STATUS_OK).json(
    //     response.createResponse(response.SUCCESS, 'Thành công', {
    //       photos: results.photos,
    //       user: results.user
    //     })
    //   );
    // });

    await User.findOne({ _id: user_id })
      .exec()
      .then(async (user) => {
        await Photo.find({ user: user_id })
          .exec()
          .then(photos => {
            console.log('user', user);
            console.log('photos', photos);

            return res.status(response.STATUS_OK).json(
              response.createResponse(response.SUCCESS, 'Thành công', {
                photos: photos,
                user: user
              })
            );
          })
          .catch(err => {
            console.log(err);
            return res.status(response.SERVER_ERROR).json(
              response.createResponse(response.ERROR, 'Đã xảy ra lỗi: ' + err)
            );
          });
      })
      .catch(err => {
        console.log(err);
        return res.status(response.STATUS_NOT_FOUND).json(
          response.createResponse(response.ERROR, 'Đã xảy ra lỗi: ' + err)
        );
      });

      

  } catch (err) {
    return res.status(response.STATUS_NOT_FOUND).json(
      response.createResponse(response.ERROR, 'Đã xảy ra lỗi: ' + err)
    );
  }
}




exports.user_account = (req, res) => {
  const id = req.userData.sub;
  User.findById(id)
    .select("name avatar")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        return res.status(response.STATUS_OK).json(
          response.createResponse(response.SUCCESS, 'Thành công', { user: doc })
        );
      } else {
        return res.status(response.STATUS_NOT_FOUND).json(
          response.createResponse(response.ERROR, 'Không tìm thấu người dùng')
        );
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(response.SERVER_ERROR).json(
        response.createResponse(response.ERROR, 'Đã xảy ra lỗi: ' + err)
      );
    });
};

//find user name
exports.findUserName = async function (req, res) {
  try {
    //get query
    let name = req.params.name;

    //get user that like the query
    const foundUsers = await User.find(
      {
        $or:
          [
            { name: { $regex: '.*' + name + '.*' } },
          ]
      },
      '_id name email avatar last_seen')
      ;
    //get user from DB

    return res.status(response.STATUS_OK).json(
      response.createResponse(response.SUCCESS, `Success`, { users: foundUsers })
    );

  } catch (e) {
    console.log(e)
    return res.status(response.STATUS_BAD_REQUEST).json(
      response.createResponse(response.ERROR, 'Something went wrong :' + e)
    );
  }
}

//update fcm key
// exports.updateFcmKey = async function (req, res) {
//   try {

//     //get fcm key
//     let fcm_key = req.params.fcm_key;

//     //update it
//     let user = await User.findByIdAndUpdate(req.user._id, { fcm_key: fcm_key });

//     return res.status(response.STATUS_OK).json(
//       response.createResponse(response.SUCCESS, `Success`, { user: user })
//     );

//   } catch (e) {
//     console.log(e)
//     return res.status(response.STATUS_BAD_REQUEST).json(
//       response.createResponse(response.ERROR, 'Something went wrong :' + e)
//     );
//   }
// }

exports.account_delete = (req, res) => {
  const id = req.userData.sub;
  User.remove({ _id: id })
    .exec()
    .then(result => {
      return res.status(response.STATUS_OK).json(
        response.createResponse(response.SUCCESS, `Xóa tài khoản thành công`)
      );
    })
    .catch(err => {
      console.log(err);
      return res.status(response.SERVER_ERROR).json(
        response.createResponse(response.ERROR, 'Đã xảy ra lỗi: ' + err)
      );
    });
};