import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  const subject = "How to have bond with your cat";
  const keywords = "how to take care of a cat, benefits of having a cat";

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(config);
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    temperature: 0,
    max_tokens: 1000,
    prompt: `Write a short, well structured and detailed SEO-friendly article about "${subject}", that targets the following comma-separated keywords: ${keywords}. 
    The content should be formatted in SEO friendly HTML. 
    The response must also include appropriate HTML title and meta description content.
    The return format must be stringified JSON in the following format: 
    {
      "articleContent": article content here
      "title": title goes here
      "metaDescription: meta description goes here
    }`,
  });

  console.log("response", response.data.choices[0].text.split("\n").join(""));

  res.status(200).json({
    article: JSON.parse(response.data.choices[0].text.split("\n").join("")),
  });
}
