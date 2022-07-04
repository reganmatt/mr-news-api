const connection = require("./db/connection");

// console.log("in model");

exports.selectTopics = () => {
  return connection.query("SELECT * FROM topics").then((result) => {
    // console.log(result.rows);
    return result.rows;
  });
};
