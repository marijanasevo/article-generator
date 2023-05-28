import { createContext, useCallback, useState } from "react";

const ArticlesContext = createContext({});

export default ArticlesContext;
export const ArticlesProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);

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
    const articlesResult = json.articles || [];

    setArticles((oldValue) => {
      return [...oldValue, ...articlesResult];
    });
    console.log("k", articles);
  }, []);

  return (
    <ArticlesContext.Provider
      value={{ articles, setArticlesFromSSR, getArticles }}
    >
      {children}
    </ArticlesContext.Provider>
  );
};
