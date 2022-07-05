const connection = require("./db/connection");

exports.selectTopics = () => {
  return connection.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
};

exports.selectArticleById = (articleId) => {
  return connection
    .query(
      `
      SELECT * FROM articles
      WHERE article_id = $1
        `,
      [articleId]
    )
    .then((result) => {
      return result.rows;
    });
};
