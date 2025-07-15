const path = require("path");

const dotenv = require("dotenv");
const envPath = path.resolve(process.cwd(),`.env${process.env.NODE_ENV != null ? `.${process.env.NODE_ENV}` : ""}`);
dotenv.config({ path: envPath });
require("./config/database");

const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


var debug = require("debug")("node-boilerplate:server");
var http = require("http");


var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  let mode = process.env.NODE_ENV == "dev" ? "Developement Mode" : "Production Mode";
  console.log("-------------------");
  console.log(mode);
  console.log("-------------------");
  console.log(`🚀🚀 App is listening on :: ${bind}`);
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

require("./routes/zindex").forEach((e) => app.use(e.path, e.file));

app.use((err, req, res, next) => {
  const statusCode =res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  let result = {
    message: err.message || "Internal Server Error",
    status: statusCode,
    data: null,
  };

  //Add Stacktrace in development mode only
  if (process.env.NODE_ENV == "dev") {
    result.stack = err.stack;
  }

  res.status(statusCode).json(result);
});

module.exports = app;
