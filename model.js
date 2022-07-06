const connection = require("./db/connection");

exports.selectTopics = () => {
  return connection.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
};

exports.selectArticleById = (articleId) => {
  const numArticleId = parseInt(articleId);
  if (isNaN(numArticleId)) {
    return Promise.reject({
      status: 422,
      message: "unprocessable entity",
    });
  } else {
    return connection
      .query(
        `
        SELECT articles.*, 
(SELECT COUNT(*) FROM comments 
WHERE comments.article_id = articles.article_id) 
AS comment_count FROM articles
WHERE article_id = $1
          `,
        [articleId]
      )
      .then((result) => {
        if (result.rowCount !== 0) return result.rows[0];
        return Promise.reject({
          status: 404,
          message: "article not found",
        });
      });
  }
};

exports.selectArticleWithNewVotes = (article_id, inc_votes) => {
  const numIncVotes = parseInt(inc_votes);
  if (isNaN(numIncVotes)) {
    return Promise.reject({
      status: 422,
      message: "unprocessable entity",
    });
  } else {
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
        [article_id, inc_votes]
      )
      .then((result) => {
        if (result.rowCount !== 0) return result.rows[0];
        return Promise.reject({
          status: 422,
          message: "unprocessable entity",
        });
      });
  }
};

exports.selectUsers = () => {
  return connection
    .query(
      `
  SELECT * FROM users
  `
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectArticles = () => {
  return connection
    .query(
      `
      SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      -- WHERE articles.article_id = 1
      GROUP BY articles.article_id
      ORDER BY created_at DESC
      `
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectCommentsById = (article_id) => {
  const numArticleId = parseInt(article_id);
  if (isNaN(numArticleId)) {
    return Promise.reject({
      status: 422,
      message: "unprocessable entity",
    });
  } else {
    return connection
      .query(
        `
      SELECT * FROM comments
WHERE article_id = $1
  `,
        [article_id]
      )
      .then((result) => {
        if (result.rows.length !== 0) return result.rows;
        return Promise.reject({
          status: 404,
          message: "article not found",
        });
      });
  }
};
