import { createContext, useCallback, useReducer } from "react";

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

    case "ADD_NEW_ARTICLE":
      return {
        ...state,
        articles: [...action.payload.articles],
      };

    default:
      return state;
  }
}

export const ArticlesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(articlesReducer, initialState);

  const setInitialArticles = useCallback((initialFiveArticles = []) => {
    dispatch({ type: "SET_INITIAL_ARTICLES", payload: initialFiveArticles });
  }, []);

  const deleteArticle = useCallback((currentArticle) => {
    dispatch({ type: "DELETE_ARTICLE", payload: currentArticle });
  }, []);

  const getArticles = useCallback(async ({ lastArticleDate }) => {
    const response = await fetch("/api/getArticles", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ lastArticleDate }),
    });

    const newArticles = await response.json();

    dispatch({ type: "GET_MORE_ARTICLES", payload: newArticles });
  }, []);

  const addArticle = useCallback(async () => {
    const lastArticleDate =
      state.articles?.[state.articles?.length - 1]?.created;

    const response = await fetch("/api/getArticles", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ lastArticleDate, insertNewPost: true }),
    });

    const newArticles = await response.json();

    dispatch({ type: "ADD_NEW_ARTICLE", payload: newArticles });
  }, [state.articles]);

  return (
    <ArticlesContext.Provider
      value={{
        articles: state.articles,
        setInitialArticles,
        getArticles,
        noMoreArticles: state.noMoreArticles,
        deleteArticle,
        addArticle,
      }}
    >
      {children}
    </ArticlesContext.Provider>
  );
};
