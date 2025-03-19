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

  db.updateOne(
    {
      _id: userId,
      "notebooks._id": new mongodb.BSON.ObjectId(body.notebookId),
    }, // Match the user and notebook
    { $set: { "notebooks.$.pages.$[page].content": body.newContent } }, // Update the `content`
    { arrayFilters: [{ "page._id": new mongodb.BSON.ObjectId(body.pageId) }] } // Specify which page to update
  );

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*", // Allows requests from any origin
    },
    body: "Successfully updated page content",
  };
};
