import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/app-layout/app-layout";
import { useState } from "react";

export default function NewArticle() {
  const [articleContent, setArticleContent] = useState("");
  const [subject, setSubject] = useState("");
  const [keywords, setKeywords] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/generate-article", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subject, keywords }),
    });

    const json = await response.json();
    console.log(json.article.articleContent);
    setArticleContent(json.article.articleContent);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} action="">
        <div>
          <label>
            <strong>I need an article on the subject of:</strong>
            <textarea
              className="textarea-input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            <strong>That targets the following keywords:</strong>
            <textarea
              className="textarea-input"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </label>
        </div>
        <button type="submit" className="button">
          Generate
        </button>
      </form>
      <div
        className="max-w-screen-sm p-10 "
        dangerouslySetInnerHTML={{ __html: articleContent }}
      ></div>
    </div>
  );
}

NewArticle.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {},
  };
});
