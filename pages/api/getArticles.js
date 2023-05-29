import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";

export default withApiAuthRequired(async function handler(req, res) {
  try {
    const {
      user: { sub },
    } = await getSession(req, res);
    const client = await clientPromise;
    const db = client.db("ArticleGenerator");
    const userProfile = await db.collection("users").findOne({
      auth0Id: sub,
    });

    const { lastArticleDate } = req.body;

    const articles = await db
      .collection("articles")
      .find({
        userId: userProfile._id,
        created: { $lt: new Date(lastArticleDate) },
      })
      .limit(5)
      .sort({ created: -1 })
      .toArray();

    res.status(200).json({ articles });
  } catch (err) {
    console.log("Error while loading more posts", err);
  }
});
