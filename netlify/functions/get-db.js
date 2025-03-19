const mongodb = require("mongodb");
require("dotenv").config();

module.exports = {
  getDatabase: async () => {
    const connectionString = process.env.MONGO_CONNECTION_STR;

    const client = new mongodb.MongoClient(connectionString);
    if (!client.isConnected) {
      try {
        await client.connect();
      } catch (e) {
        return e;
      }
    }
    return mongodb;
    console.log(client.db("Users"));
    return client.db("Users").collection("users");
  },
};
