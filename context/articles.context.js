import { createContext, useCallback, useState } from "react";

const ArticlesContext = createContext({});

export default ArticlesContext;
export const ArticlesProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [noMoreArticles, setNoMoreArticles] = useState(false);

  const deletePost = useCallback((currentArticle) => {
    const newArticles = articles.filter((article) => {
      return article._id !== currentArticle;
    });

    setArticles(newArticles);
  }, []);

  const setArticlesFromSSR = useCallback((articlesFromSSR = []) => {
    setArticles((oldValue) => [...articlesFromSSR]);
  }, []);

  const getArticles = useCallback(async ({ lastArticleDate }) => {
    const result = await fetch("/api/getArticles", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ lastArticleDate }),
    });

    const json = await result.json();
    const newArticles = json.articles || [];

    if (newArticles.length < 5) setNoMoreArticles(true);

    setArticles((existingArticles) => {
      return [...existingArticles, ...newArticles];
    });
  }, []);

  return (
    <ArticlesContext.Provider
      value={{
        articles,
        setArticlesFromSSR,
        getArticles,
        noMoreArticles,
        deletePost,
      }}
    >
      {children}
    </ArticlesContext.Provider>
  );
};
