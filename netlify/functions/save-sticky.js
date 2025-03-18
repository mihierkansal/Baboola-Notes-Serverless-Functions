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
  let newSticky;

  if (body.existingSticky) {
    newSticky = {
      content: body.content,
      _id: body.existingSticky,
      createdAt:
        userWithEmail.stickies.find(
          (sticky) => sticky._id.toString() === body.existingSticky
        )?.createdAt ?? "created",
      updatedAt: new Date().toISOString(),
    };

    await db.updateOne(
      {
        _id: userId,
        "stickies._id": new mongodb.BSON.ObjectId(
          body.existingSticky.toString()
        ),
      },
      {
        $set: {
          "stickies.$.content": newSticky.content,
          "stickies.$.updatedAt": newSticky.updatedAt,
        },
      }
    );
  } else {
    newSticky = {
      content: body.content,
      _id: new mongodb.ObjectId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.updateOne(
      { _id: userId }, // Filter to find the user by their ID
      { $push: { stickies: newSticky } } // Push newSticky into the stickies array
    );
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*", // Allows requests from any origin
    },
    body: JSON.stringify(newSticky),
  };
};
