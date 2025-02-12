const http = require("http");
const getUsers = require("../users");
const moment = require("moment");
const express = require("express");
const { stat } = require("fs");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/about", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "This is the about page",
  });
});

app.get("/date", (req, res) => {
  res.send(moment().format("MMMM Do YYYY, h:mm:ss a"));
});

app.post("/users", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "User created successfully",
  });
});

app.put("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Successfully requested put method",
  });
});

app.delete("/users/:id", (req, res) => {
  res.send(`Successfully deleted user ${req.params.id}`);
});

app.patch("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Successfully requested patch method",
  });
});

app.all("/universal", (req, res) => {
  res.send("Requested method is " + req.method);
});

app.get("/post", (req, res) => {
  const { page, sort } = req.query;
  res.send(`Requested page is ${page} sort is ${sort}`);
});

const hostname = "127.0.0.1";
const port = 3000;
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
