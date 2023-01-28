const fs = require("fs");
const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

// LOAD THE LOGEVENTS MODULE
const logEvents = require("./logEvents");

myEmitter.addListener("route", (event, level, msg) => {
  const d = new Date();
  console.log(d.toLocaleString() + " * " + level.toUpperCase() + " * " + msg);
  logEvents(event, level.toUpperCase(), msg);
});

// INDEX PAGE
function indexPage(path, event, response) {
  displayFile(path, response);
  myEmitter.emit("route", event, "information", "the home page was visited.");
}

// ABOUT PAGE
function aboutPage(path, event, response) {
  displayFile(path, response);
  myEmitter.emit("route", event, "information", "the about page was visited.");
}
// CONTACT PAGE
function contactPage(path, event, response) {
  displayFile(path, response);
  myEmitter.emit(
    "route",
    event,
    "information",
    "the contact page was visited."
  );
}
// SUBSCRIBE PAGE
function subscribePage(path, event, response) {
  displayFile(path, response);
  myEmitter.emit(
    "route",
    event,
    "information",
    "the subscribe page was visited."
  );
}

// PRODUCTS PAGE
function productsPage(path, event, response) {
  displayFile(path, response);
  myEmitter.emit(
    "route",
    event,
    "information, the products page has been visited."
  );
}

function asynchronous(path, event, response) {
  let readName = path + "readMe.txt";
  fs.readFile(readName, "utf8", function (err, readMe) {
    if (err) {
      myEmitter.emit(
        "route",
        event,
        "failure",
        `${readName} file was not read.`
      );
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.write(`${readName} file was NOT read.`);
    } else {
      let writeName = path + "writeMe.txt";
      fs.writeFile(writeName, readMe, function (err) {
        if (err) {
          myEmitter.emit(
            "route",
            event,
            "failure",
            `${writeName} file was not written.`
          );
          response.writeHead(404, { "Content-Type": "text/plain" });
          response.write(`${writeName} file was NOT written.`);
        } else {
          myEmitter.emit(
            "route",
            event,
            "success",
            `${readName} file was successfully read.`
          );
          response.write(`${readName} file was successfully written.`);
          myEmitter.emit(
            "route",
            event,
            "success",
            `${writeName} file was successfully written.`
          );
          response.write(`\n${writeName} file was successfully written.`);
        }
      });
    }
    response.end();
  });
}

function fourOfourPage(path, event, response) {
  displayFile(path, response);
  myEmitter.emit(
    "route",
    event,
    "error",
    "a routing error occured for the " + event + " route."
  );
}

function displayFile(path, response) {
  fs.readFile(path, function (err, data) {
    if (err) {
      console.log(err);
      response.end();
    } else {
      response.writeHead(response.statusCode, { "Content-Type": "text/html" });
      response.write(data);
      response.end();
    }
  });
}

module.exports = {
  indexPage,
  aboutPage,
  contactPage,
  subscribePage,
  fourOfourPage,
  productsPage,
  // ronniePage,

  asynchronous,
};
