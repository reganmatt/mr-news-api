const express = require("express");

const {
  getTopics,
  getArticleById,
  patchVotesByArticleId,
} = require("./controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchVotesByArticleId);

app.use("*", (req, res) => {
  res.status(404).send({ message: "path not found" });
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(err.status).send({ message: "article not found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(422).send({ message: "unprocessable entity" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "server error" });
});

module.exports = app;
