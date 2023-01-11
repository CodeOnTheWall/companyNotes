const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const loginLimiter = require("../middleware/loginLimiter");

// rest api sends and recieves access tokens as json data.
// when app is closed, access token is lost as its stored in memory
// rest api will issue refresh tokens which are in an httpOnly cookie, these tokens do expire and will require login again
// with these tokens, client can access protected api routes until expiration

// this / is /auth, via server.js
// when a user is authenticated, an aT and a rT are made using jwt, our rest api sends the aT as a js object to front end, and rT is sent inside a cookie by the server
// aT is given short time before it expires 5-15min, and rT is longer time hours to days
router.route("/").post(loginLimiter, authController.login);

// /auth/refresh
router.route("/refresh").get(authController.refresh);

// /auth/logout
router.route("/logout").post(authController.logout);

module.exports = router;
