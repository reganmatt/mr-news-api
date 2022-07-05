const {
  selectTopics,
  selectArticleById,
  selectArticleWithNewVotes,
} = require("./model");

exports.getTopics = (req, res) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics: topics });
  });
};

exports.getArticleById = (req, res) => {
  const { article_id } = req.params;
  selectArticleById(article_id).then((selectedArticle) => {
    if (selectedArticle.length === 0) {
      res.status(404).send({ message: "path not found" });
    } else {
      res.status(200).send({ article: selectedArticle });
    }
  });
};

exports.patchVotesByArticleId = (req, res) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  if (typeof inc_votes === "number") {
    selectArticleWithNewVotes(article_id, inc_votes).then((selectedArticle) => {
      res.status(200).send({ article: selectedArticle });
    });
  } else {
    res.status(422).send({ message: "unprocessable entity" });
  }
};
