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

module.exports = app;
