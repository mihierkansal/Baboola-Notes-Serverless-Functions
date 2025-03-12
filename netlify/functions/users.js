const mongodb = require("mongodb");
require("dotenv").config();
exports.handler = async (event, context) => {
  const connectionString = process.env.MONGO_CONNECTION_STR;
  const client = new mongodb.MongoClient(connectionString);

  const getDatabase = async () => {
    if (!client.isConnected) {
      await client.connect();
    }
    console.log(client.db("Users"));
    return client.db("Users").collection("users"); // Replace with your database name
  };

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain", // For plain text responses
      "Access-Control-Allow-Origin": "*", // Allows requests from any origin
    },
    body: JSON.stringify(await (await getDatabase()).find().toArray()),
  };
};
