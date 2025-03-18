const mongodb = require("mongodb");

require("dotenv").config();
const authFunctions = require("./verify-auth.js");
exports.handler = async (event, context) => {
  const { getDatabase } = require("./get-db.js");
  const auth = event.headers["bab-auth"];

  const verif = authFunctions.verifyAuth(auth);
  if (verif.statusCode !== 200) {
    return verif;
  }
  const email = verif.body;

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain", // For plain text responses
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
    body: "KKS",
  };
  const db = await getDatabase();
  let userWithEmail = (await db.find({ email }).toArray())[0];

  if (!userWithEmail) {
    const newUser = {
      email,
      _id: new mongodb.ObjectId(),
      notebooks: [],
      stickies: [],
    };
    await db.insertOne(newUser);
    userWithEmail = newUser;
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain", // For plain text responses
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
    body: JSON.stringify(userWithEmail),
  };
};
