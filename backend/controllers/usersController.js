// MONGOOSE - here im using mongoose methods on my Models (User and Note Models)
// according to docs, use.exec when passing in something and/or needing a promise when using mongoose methods
// in headers on postman/thunderclient add Content-Type app/json for testing (and send raw data in body)

// lean() mongoose method:
// Docs returned from queries with the lean option enabled are plain javascript
// objects, not Mongoose Documents. They have no save method, getters/setters, virtuals,
// or other Mongoose features. lean is great for high-perf, read-only cases
// exec() mongoose method:
// returns a promise and executes the query

// no next on controller methods, since the controller is the final step when processing the data and sending a response

// finding User model from our mongooseSchema which defines the structure of the document, default values,
// validators, etc., whereas a Mongoose model provides an interface to the database for creating, querying, updating, deleting records
const User = require("../models/User");
const Note = require("../models/Note");

// for passwords
const bcrypt = require("bcrypt");

// get all users, /users - get, access private
const getAllUsers = async (req, res) => {
  // find all users from User Model from mongoDB (User.find -  Model.find mongoose method), select which things not to include on response (password)
  const users = await User.find().select("-password").lean();

  // if no user, also if user but user has no length (option chaining ?.)
  if (!users?.length) {
    // status() sets a HTTP status on the response (as a Javascript object on the server side)
    // chaining on methods to the res, the status code, and the JS object message to be sent with the res
    return res.status(400).json({ message: "No users found" });
  }
  // .json converts the json to a js object to be read in the res (which i can see under /users)
  res.json(users);
};

// create new user, /users - post, access private
const createNewUser = async (req, res) => {
  // destructuring from the expected req.body: a username, a password, and a roles array which contains the set role(s)
  const { username, password, roles } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate username
  // find one User (Model.findOne mongoose method) who has username of above destructured username
  // returns plain js object instead of mongoose doc via .lean(), then executes that (gives me a promise)
  const duplicate = await User.findOne({ username })
    // collation with strength 2 checks for case sensitivity, hence I can find via walter or Walter
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    // 409 conflict
    return res.status(409).json({ message: "Duplicate username" });
  }

  // Hash password - passing in password from req.body, salting 10 times
  const hashedPwd = await bcrypt.hash(password, 10);

  // if we do not have an array of roles or if we have an array but it has no length (empty)
  const userObject =
    !Array.isArray(roles) || !roles.length
      ? { username, password: hashedPwd }
      : { username, password: hashedPwd, roles };

  // Create and store new user - sending back to UserModel
  const user = await User.create(userObject);

  // if we created user
  // .json is taking the JSON and parsing it into a JS object
  if (user) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
};

// update user, /users - patch, access private
const updateUser = async (req, res) => {
  const { id, username, roles, active, password } = req.body;
  console.log(id);

  // Confirm data
  if (
    !id ||
    !username ||
    // there is no array, or array is empty
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return (
      res
        // bad req 400
        .status(400)
        .json({ message: "All fields except password are required" })
    );
  }

  // Does the user exist to update?
  // we arent calling lean to make this a mongoose document that does have save and other methods attached to it
  // calling exec because i need the promise after passing the value in
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Check for duplicate - chaining lean because dont need the methods returned with this, and exec as well
  const duplicate = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  console.log(duplicate);

  // mongodb stores id as such: _id
  // if duplicate (user found from mongodb) has different id than the one passed in, then we have duplicate username
  // but if equal, we are just working with current user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  //   this is a mongoose document, since we didnt .lean on the User.findById(id)
  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    // Hash password
    user.password = await bcrypt.hash(password, 10);
  }

  // this is where i needed the mongoosedoc so that i have the save method (by not using .lean)
  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.username} updated` });
};

// delete new user, /users - delete, access private
const deleteUser = async (req, res) => {
  // destructure id from req.body
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  // Does the user still have assigned notes?
  // find one Note whos user has the passed in id (since in noteSchema, all notes have a user with an ObjectId (_id))
  const note = await Note.findOne({ user: id }).lean().exec();
  //  if it doesnt find anything it will be null, otherwise theres a note
  if (note) {
    return res.status(400).json({ message: "User has assigned notes" });
  }

  // Does the user exist to delete?
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // result recieves the full user object that was deleted
  const result = await user.deleteOne();

  const reply = `Username ${result.username} with ID ${result._id} deleted`;

  res.json(reply);
};

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
