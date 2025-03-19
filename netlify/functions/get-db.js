const mongodb = require("mongodb");
require("dotenv").config();

module.exports = {
  getDatabase: async () => {
    return mongodb;
    const connectionString = process.env.MONGO_CONNECTION_STR;

    const client = new mongodb.MongoClient(connectionString);
    if (!client.isConnected) {
      await client.connect();
    }
    console.log(client.db("Users"));
    return client.db("Users").collection("users");
  },
};
