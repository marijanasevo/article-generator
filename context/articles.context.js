import { createContext, useCallback, useState } from "react";

const ArticlesContext = createContext({});

export default ArticlesContext;
export const ArticlesProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);

  const setArticlesFromSSR = useCallback((articlesFromSSR = []) => {
    setArticles(articlesFromSSR);
  }, []);

  return (
    <ArticlesContext.Provider value={{ articles, setArticlesFromSSR }}>
      {children}
    </ArticlesContext.Provider>
  );
};
