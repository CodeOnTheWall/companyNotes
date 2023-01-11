// getting mongoose models
// Mongoose model provides an interface to the database for creating, querying, updating, deleting records
const Note = require("../models/Note");
const User = require("../models/User");

// get all notes, /notes - get, private access
const getAllNotes = async (req, res) => {
  // find notes from MongoDB (using Model.find mongoose method)
  // dont need any methods so I can .lean - great for read only cases
  const notes = await Note.find().lean();

  // if no notes or theres notes but has no length
  if (!notes?.length) {
    return res.status(400).json({ message: "No notes found" });
  }

  // Add username to each note before sending the response
  // The Promise.all() method takes an iterable of promises as input and returns a single Promise, as an Array
  // hence notesWithUser will be an array of objects, each object being a note with an assigned user
  const notesWithUser = await Promise.all(
    // map over notes
    notes.map(async (note) => {
      // find the User that has id of note.user (since note.user is an id from noteSchema)
      // heres the promise that will be returned into notesWithUser
      const user = await User.findById(note.user).lean().exec();
      // console.log("passedInNote", note);
      // console.log("associatedUser", user);
      // return rest of note (spread opp) (title, text, completed etc) and add a username to it
      // that username is the username from userSchema (after matching id's)
      return { ...note, username: user.username };
    })
  );
  // console.log(notesWithUser);

  // .json converts the json to a js object to be read in the res (which i can see under /notes)
  res.json(notesWithUser);
};

// create note, /notes - post, private access
const createNewNote = async (req, res) => {
  // expect these values from req.body, as thats the noteSchema
  const { user, title, text } = req.body;

  // Confirm data
  if (!user || !title || !text) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate title
  const duplicate = await Note.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate note title" });
  }

  // Create and store the new note
  const note = await Note.create({ user, title, text });

  if (note) {
    // Created
    return res.status(201).json({ message: "New note created" });
  } else {
    return res.status(400).json({ message: "Invalid note data received" });
  }
};

// update note, /notes - patch, private access
const updateNote = async (req, res) => {
  const { id, user, title, text, completed } = req.body;

  // Confirm data
  if (!id || !user || !title || !text || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Confirm note exists to update
  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }

  // Check for duplicate title
  const duplicate = await Note.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  // Allow renaming of the original note
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate note title" });
  }

  note.user = user;
  note.title = title;
  note.text = text;
  note.completed = completed;

  const updatedNote = await note.save();

  res.json(`'${updatedNote.title}' updated`);
};

// delete note, /notes - delete, private access
const deleteNote = async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Note ID required" });
  }

  // Confirm note exists to delete
  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }

  // deletes from collection
  const result = await note.deleteOne();

  const reply = `Note '${result.title}' with ID ${result._id} deleted`;

  res.json(reply);
};

module.exports = {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
};
