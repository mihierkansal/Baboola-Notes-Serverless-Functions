const authFunctions = require("./verify-auth.js");
const mongodb = require("mongodb");
exports.handler = async (event, context) => {
  const { getDatabase } = require("./get-db.js");
  const auth = event.headers["bab-auth"];
  const verif = authFunctions.verifyAuth(auth);
  if (verif.statusCode !== 200) {
    return verif;
  }
  const email = verif.body;

  const db = await getDatabase();

  let userWithEmail = (await db.find({ email }).toArray())[0];

  const userId = userWithEmail._id;
  const body = JSON.parse(event.body);
  let newNotebook;

  newNotebook = {
    name: body.notebookName,
    _id: new mongodb.ObjectId(),
    createdAt: new Date().toISOString(),
    pages: [],
  };

  await db.updateOne(
    { _id: userId }, // Filter to find the user by their ID
    { $push: { notebooks: newNotebook } } // Push into the array
  );

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*", // Allows requests from any origin
    },
    body: JSON.stringify(newNotebook),
  };
};
