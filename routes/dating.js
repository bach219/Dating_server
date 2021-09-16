var express = require('express');
var router = express.Router();
const { auth } = require('../middlewares/auth');
const registerValidator = require("../middlewares/validators/registerValidator");
const loginValidator = require("../middlewares/validators/loginValidator");

// Require our controllers.
var auth_controller = require('../controllers/AuthController');

// adding new user (sign-up route)
router.post('/api/register', [registerValidator], auth_controller.register);

// login user
router.post('/api/login', [loginValidator], auth_controller.login);

// //logout user
router.get('/api/logout', auth, auth_controller.logout);


router.get('/', function (req, res) {
  res.status(200).send(`Welcome to login , sign-up api`);
});

module.exports = router;
