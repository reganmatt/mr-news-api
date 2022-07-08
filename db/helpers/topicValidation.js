const connection = require("../connection");

exports.topicValidation = (topic) => {
  return connection.query(
    `
    SELECT * FROM topic
    WHERE slug = $1
    `,
    [topic]
  );
};
