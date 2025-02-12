const http = require("http");
const getUsers = require("../users");
const moment = require("moment");
const express = require("express");
const { stat } = require("fs");

const app = express();

app.get("/", (req, res) => {
  res.send("This is the home page");
});

app.get("/about", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "response success",
    date: moment().format("MMMM Do YYYY, h:mm:ss a"),
  });
});

app.get("/users", (req, res) => {
  res.status(200).json({
    getUsers,
  });
});

app.get("/:id", (req, res) => {
  res.status(404).json({
    status: "error",
    message: "not found",
    date: moment().format(),
  });
});

const hostname = "127.0.0.1";
const port = 3000;
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
