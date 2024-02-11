const express = require("express");
const connection = require("./connection");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Echo Dome server api routes" });
});

const server = app.listen(
  port,
  console.log(`Server running on port ${port}`.yellow.bold)
);
