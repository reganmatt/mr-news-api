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
      if (result.rowCount !== 0) return result.rows[0];
      return Promise.reject({
        status: 404,
        message: "path not found",
      });
    });
};

exports.selectArticleWithNewVotes = (article_id, inc_votes) => {
  const patchArr = [];
  patchArr.push(article_id, inc_votes);
  return connection
    .query(
      `
      UPDATE articles
      SET
      votes = articles.votes + $2
      WHERE
      article_id = $1
      RETURNING *
    `,
      patchArr
    )
    .then((result) => {
      return result.rows;
    });
};
