const { selectTopics } = require("./model");

// console.log("in controller");

exports.getTopics = (req, res) => {
  selectTopics().then((topics) => {
    // console.log(topics);
    res.status(200).send(topics);
  });
};
