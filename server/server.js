const express = require("express");
const connection = require("./connection");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Echo Dome server api routes" });
});

const server = app.listen(port, async () => {
  try {
    await connection;
    console.log(`mongodb connected`.cyan.underline);
    console.log(`listening on port ${port}`.yellow.bold);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
  }
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});
