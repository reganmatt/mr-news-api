const { selectTopics, selectArticleById } = require("./model");

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
