import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
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
}
