const mongoose = require("mongoose");
// middleware to create ticket number
const AutoIncrement = require("mongoose-sequence")(mongoose);

const noteSchema = new mongoose.Schema(
  {
    user: {
      // what type of data this is (objectId) and its from another schema
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      //   this is referring to which schema, the User schema
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    // false to start because when i create a new note, it will be open and not completed
    completed: {
      type: Boolean,
      default: false,
    },
  },
  //   options, hence seperate object
  //   this is createdAt and updatedAt timestamps by setting this option below
  {
    timestamps: true,
  }
);

noteSchema.plugin(AutoIncrement, {
  // setting options
  // name of increment field, this will create a ticket field inside of our schema
  inc_field: "ticket",
  //   a seperate collection named counter will be created containing these id's
  id: "ticketNums",
  //   what number to start sequence at
  start_seq: 500,
});

module.exports = mongoose.model("Note", noteSchema);
