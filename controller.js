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

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((selectedArticle) => {
      res.status(200).send({ article: selectedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVotesByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  selectArticleWithNewVotes(article_id, inc_votes)
    .then((selectedArticle) => {
      res.status(200).send({ article: selectedArticle });
    })
    .catch((err) => {
      next(err);
    });
};
