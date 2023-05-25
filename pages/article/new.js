import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/app-layout/app-layout";
import { useState } from "react";

export default function NewArticle() {
  const [articleContent, setArticleContent] = useState("");

  const handleClick = async () => {
    const response = await fetch("/api/generate-article", {
      method: "POST",
    });

    const json = await response.json();
    console.log(json.article.articleContent);
    setArticleContent(json.article.articleContent);
  };

  return (
    <div>
      <h1>This is the new article page</h1>
      <p>and</p>
      <button className="button" onClick={handleClick}>
        Generate
      </button>
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
