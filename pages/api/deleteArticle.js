import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default withApiAuthRequired(async (req, res) => {
  try {
    const {
      user: { sub },
    } = await getSession(req, res);
    const client = await clientPromise;
    const db = client.db("ArticleGenerator");
    const userProfile = await db.collection("users").findOne({
      auth0Id: sub,
    });

    const { currentArticle } = req.body;

    await db.collection("articles").deleteOne({
      userId: userProfile._id,
      _id: ObjectId(currentArticle),
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.log("Article deletion failure: ", err);
  }
});
