const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notesController");

// const verifyJWT = require("../middleware/verifyJWT");
// middleware will apply to all routes in this file
// router.use(verifyJWT);

router
  // the / is /notes as the endpoint
  .route("/")
  .get(notesController.getAllNotes)
  .post(notesController.createNewNote)
  .patch(notesController.updateNote)
  .delete(notesController.deleteNote);

module.exports = router;
