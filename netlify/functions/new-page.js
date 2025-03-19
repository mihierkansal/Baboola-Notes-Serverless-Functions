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
  let newPage;

  newPage = {
    title: body.pageTitle,
    _id: new mongodb.ObjectId(),
    createdAt: new Date().toISOString(),
    content: body.content,
  };

  await db.updateOne(
    {
      _id: userId,
      "notebooks._id": new mongodb.BSON.ObjectId(body.notebookId),
    },
    { $push: { "notebooks.$.pages": newPage } }
  );

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*", // Allows requests from any origin
    },
    body: `${JSON.stringify(newPage)}, ${JSON.stringify(body)}`,
  };
};
