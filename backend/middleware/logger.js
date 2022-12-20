// 3rd party middleware
const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

// file system from nodejs
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

// helper function
const logEvents = async (message, logFileName) => {
  // new Date object, and formatting it the way i like below, \t is tab
  const dateTime = format(new Date(), "yyyyMMdd\tHH:mm:ss");
  // uuid creates spec id for each log item, \n is line break
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    // if log directory doesnt exist
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      // then make the directory
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    // then create file inside logs folder, with the data inside being the logItem itself
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

// custom middleware, needs next to be able to go to next middleware and run that
const logger = (req, res, next) => {
  // headers.origin is where req originated from, what url, this will be undefined in dev
  // this will be the passed in message, logFileName that goes into logEvents
  // .log is like txt file but its the convention from writing logs
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
  console.log(`${req.method} ${req.path}`);
  next();
};

module.exports = { logEvents, logger };
