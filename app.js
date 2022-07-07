const express = require("express");

const {
  getTopics,
  getArticleById,
  patchVotesByArticleId,
  getUsers,
  getArticles,
  getCommentsById,
  postCommentById,
} = require("./controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchVotesByArticleId);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsById);
app.post("/api/articles/:article_id/comments", postCommentById);

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
  if (err.status === 400) {
    res.status(err.status).send({ message: "bad request, missing fields" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "server error" });
});

module.exports = app;
