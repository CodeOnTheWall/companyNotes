const express = require("express");
const router = express.Router();
// need a controller to handle routes
const {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
} = require("../controllers/usersController");

// const verifyJWT = require("../middleware/verifyJWT");
// middleware will apply to all routes in this file
// router.use(verifyJWT);

// all our controller methods that go to /users
router
  // this route will match the users route (so / is actually /users)
  .route("/")
  //  chaining methods
  //   read
  .get(getAllUsers)
  //   create
  .post(createNewUser)
  //   update
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
