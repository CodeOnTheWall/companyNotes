// allows to use dotenv throughout the package (dont need to import to other files)
// to use env variables inside rest api
require("dotenv").config();
// express
const express = require("express");
// all .app is express
const app = express();
// nodeJs
const path = require("path");
// custom middleware
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");

// run on process.env.PORT (prod) otherwise on 3500 (dev)
const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

// initializing connection to DB
connectDB();

// want to log before any other middlewars
app.use(logger);

// stops other website from trying to access our apis
app.use(cors(corsOptions));

// ability to process json middleware - recieve and parse json data
app.use(express.json());
// parse cookies that we recieve
app.use(cookieParser());

// listening for route route
// to serve static files such as images, CSS files, and JavaScript files,
// use the express.static built-in middleware function in Express.
// __dirname is a global variable that nodejs understands (look inside folder that we are in (of current file opened))
// so look inside backend dir, then look for public folder
// express.static is built in middleware
app.use("/", express.static(path.join(__dirname, "public")));
// or, since its relative to folder we are in
// app.use(express.static('public'))

// listening to ./routes/root
app.use("/", require("./routes/root"));

// put this after all the other routes to handle anything (*) not found
// status() sets a HTTP status on the response (as a Javascript object on
// the server side). sendStatus() sets the status and sends it to the client
app.all("*", (req, res) => {
  // 404 not found
  res.status(404);
  //   now looking at headers from req that come in, and determine what type of res to send
  //   if req has an accepts header that is html
  if (req.accepts("html")) {
    // then send res to 404.html
    res.sendFile(path.join(__dirname, "views", "404.html"));
    // if header has json
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
    // if html or json wasnt matched in the accepts header
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

// telling app to start listening on open event
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

// listening to error on our connection to mongo
mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    // error number
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    //  new file to be created if theres mongo error (via logEvents func)
    "mongoErrLog.log"
  );
});
