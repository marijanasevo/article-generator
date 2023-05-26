import { Configuration, OpenAIApi } from "openai";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";

export default withApiAuthRequired(async function handler(req, res) {
  const { user } = await getSession(req, res);
  const client = await clientPromise;
  const db = client.db("ArticleGenerator");
  const userProfile = await db.collection("users").findOne({
    auth0Id: user.sub,
  });

  if (!userProfile?.availableTokens) {
    res.status(403);
    return;
  }

  const { subject, keywords } = req.body;

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(config);

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: "You are an article generator",
      },
      {
        role: "user",
        content: `Write short, well structured and detailed SEO-friendly article about "${subject}", that targets the following comma-separated keywords: ${keywords}.
        The content should be formatted in SEO friendly HTML.
        The response must also include appropriate HTML title and meta description content.
        The return format must strictly be a stringified JSON (and nothing else) in the following format: 
        {
          "articleContent": article content here,
          "title": title goes here,
          "metaDescription: meta description goes here
        }`,
      },
    ],
  });

  console.log("response: ", response.data.choices[0].message.content);

  await db.collection("users").updateOne(
    {
      auth0Id: user.sub,
    },
    {
      $inc: {
        availableTokens: -5,
      },
    }
  );

  const parsed = JSON.parse(response.data.choices[0].message.content);

  const article = await db.collection("articles").insertOne({
    articleContent: parsed?.articleContent,
    title: parsed?.title,
    metaDescription: parsed?.metaDescription,
    subject,
    keywords,
    userId: userProfile._id,
    created: new Date(),
  });

  res.status(200).json({
    article: JSON.parse(response.data.choices[0].message.content),
  });

  // const response = await openai.createCompletion({
  //   model: "text-davinci-003",
  //   temperature: 0,
  //   max_tokens: 2600,
  //   prompt: `Write a short, well structured and detailed SEO-friendly
  //   article about "${subject}", that targets the following comma-separated keywords: ${keywords}.
  //   The content should be formatted in SEO friendly HTML.
  //   The response must also include appropriate HTML title and meta description content.
  //   The return format must strictly be a stringified JSON (and nothing else) in the following format:
  //   {
  //     "articleContent": article content here,
  //     "title": title goes here,
  //     "metaDescription: meta description goes here
  //   }`,
  // });

  // res.status(200).json({
  //   article: JSON.parse(response.data.choices[0].text.split("\n").join("")),
  // });
});
