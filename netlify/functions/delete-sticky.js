const authFunctions = require("./verify-auth.js");

const mongodb = require("mongodb");
exports.handler = async (event, context) => {
  const { getDatabase } = require("./get-db.js");
  const auth = event.headers["authorization"];
  const verif = authFunctions.verifyAuth(auth);
  if (verif.statusCode === 401) {
    return verif;
  }
  const email = verif.body;

  const db = await getDatabase();

  let userWithEmail = (await db.find({ email }).toArray())[0];

  const userId = userWithEmail._id;
  const body = JSON.parse(event.body);

  await db.updateOne(
    { _id: userId },
    { $pull: { stickies: { _id: new mongodb.ObjectId(body.sticky) } } }
  );

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain", // For plain text responses
      "Access-Control-Allow-Origin": "*", // Allows requests from any origin
    },
    body: "Deleted successfully.",
  };
};
