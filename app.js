const express = require("express");

const { getTopics, getAPI } = require("./controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.use("*", (req, res) => {
  res.status(404).send({ message: "path not found" });
});

module.exports = app;
