const mongodb = require("mongodb");
exports.handler = async (event, context) => {
  console.log(mongodb);
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain", // For plain text responses
      "Access-Control-Allow-Origin": "*", // Allows requests from any origin
    },
    body: '{ msg: "Hello, World!" }',
  };
};
