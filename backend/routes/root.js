// express
const express = require("express");
const router = express.Router();
// nodejs
const path = require("path");

// regex, ^ (carrot - at beg of string only) $ (at end of string only)
// hence the beg and end can only be just /
// | is or in regex, so a user can req / or /index, and ? makes the .html optional to add
router.get("^/$|/index(.html)?", (req, res) => {
  // sending the file index.html back if a get req is sent to / or /index
  // dirname is current folder, the up a level, into views folder, then into index.html
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;
