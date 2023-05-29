import { createContext, useCallback, useState } from "react";

const ArticlesContext = createContext({});

export default ArticlesContext;
export const ArticlesProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [noMoreArticles, setNoMoreArticles] = useState(false);

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
    console.log(json);
    const newArticles = json.articles || [];

    if (newArticles.length < 5) setNoMoreArticles(true);

    setArticles((existingArticles) => {
      return [...existingArticles, ...newArticles];
    });
  }, []);

  return (
    <ArticlesContext.Provider
      value={{ articles, setArticlesFromSSR, getArticles, noMoreArticles }}
    >
      {children}
    </ArticlesContext.Provider>
  );
};
