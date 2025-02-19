const users = require("../../users");
const moment = require("moment");
const morgan = require("morgan");
const express = require("express");

const app = express();

app.use(morgan("dev"));

app.get("/users", (req, res) => {
  res.status(200).json(users);
});

app.get("/users/:name", (req, res) => {
  const userName = req.params.name.toLowerCase();
  const user = users.find((u) => u.name.toLowerCase() === userName);

  if (!user) {
    return res.status(404).json({ message: "Data user tidak ditemukan" });
  }

  res.json(user);
});

app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    message: "resource not found",
  });
});

app.get("/error", (req, res) => {
  throw new Error("Error");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "terjadi kesalahan pada server",
  });
});

const hostname = "127.0.0.1";
const port = 3000;
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
