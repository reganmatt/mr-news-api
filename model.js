const connection = require("./db/connection");
const articles = require("./db/data/test-data/articles");
const { topicValidation } = require("./db/helpers/topicValidation");

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

exports.selectArticles = (sort_by = "created_at", order = "desc", topic) => {
  const validSortOptions = [
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
  ];
  const validTopicOptions = ["cats", "mitch", "paper", undefined];

  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  if (!validSortOptions.includes(sort_by)) {
    return Promise.reject("Invalid sort_by query");
  }

  if (!validTopicOptions.includes(topic)) {
    return Promise.reject({ status: 404, msg: "article not found" });
  }

  if (topic === undefined) {
    return connection
      .query(
        `
      SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY ${sort_by} ${order};
      `
      )
      .then((result) => {
        return result.rows;
      });
  } else {
    return connection
      .query(
        `
      SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.topic = $1
      GROUP BY articles.article_id
      ORDER BY ${sort_by} ${order};
      `,
        [topic]
      )
      .then((result) => {
        return result.rows;
      });
  }
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

exports.insertCommentById = (article_id, newComment) => {
  const { username, body } = newComment;
  if (!username && !body) {
    return Promise.reject({
      status: 400,
      message: "bad request, missing fields",
    });
  }
  return connection
    .query(
      `
        INSERT INTO comments
(author, body, article_id)
VALUES
($1, $2, $3)
RETURNING *;
    `,
      [username, body, article_id]
    )
    .then((result) => {
      if (result.rows.length !== 0) return result.rows[0];
      return Promise.reject({
        status: 404,
        message: "article not found",
      });
    });
};
