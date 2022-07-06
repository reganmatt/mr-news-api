const express = require("express");

const {
  getTopics,
  getArticleById,
  patchVotesByArticleId,
  getUsers,
  getArticles,
} = require("./controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchVotesByArticleId);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);

app.use("*", (req, res) => {
  res.status(404).send({ message: "path not found" });
});

app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(err.status).send({ message: "article not found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status === 422) {
    res.status(err.status).send({ message: "unprocessable entity" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "server error" });
});

module.exports = app;
