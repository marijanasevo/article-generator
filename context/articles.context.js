import { createContext, useCallback, useReducer, useState } from "react";

const ArticlesContext = createContext({});

export default ArticlesContext;

const initialState = {
  articles: [],
  noMoreArticles: false,
};

function articlesReducer(state, action) {
  switch (action.type) {
    case "SET_INITIAL_ARTICLES":
      return {
        ...state,
        articles: [...action.payload],
      };

    case "DELETE_ARTICLE":
      return {
        ...state,
        articles: state.articles.filter(
          (article) => article._id !== action.payload
        ),
      };

    case "GET_MORE_ARTICLES":
      const newArticles = action.payload.articles || [];

      return {
        ...state,
        articles: [...state.articles, ...newArticles],
        noMoreArticles: newArticles.length < 5,
      };

    default:
      return state;
  }
}

export const ArticlesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(articlesReducer, initialState);

  const deleteArticle = useCallback((currentArticle) => {
    dispatch({
      type: "DELETE_ARTICLE",
      payload: currentArticle,
    });
  }, []);

  const setInitialArticles = useCallback((articlesFromSSR = []) => {
    dispatch({ type: "SET_INITIAL_ARTICLES", payload: articlesFromSSR });
  }, []);

  const getArticles = useCallback(async ({ lastArticleDate }) => {
    const response = await fetch("/api/getArticles", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ lastArticleDate }),
    });

    const returnedArticles = await response.json();

    dispatch({ type: "GET_MORE_ARTICLES", payload: returnedArticles });
  }, []);

  return (
    <ArticlesContext.Provider
      value={{
        articles: state.articles,
        setInitialArticles,
        getArticles,
        noMoreArticles: state.noMoreArticles,
        deleteArticle,
      }}
    >
      {children}
    </ArticlesContext.Provider>
  );
};
