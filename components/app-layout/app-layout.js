import Image from "next/image";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Logo } from "../logo/logo";
import { useContext, useEffect, useState } from "react";
import ArticlesContext from "../../context/articles.context";
import { useRouter } from "next/router";

export const AppLayout = ({
  children,
  availableTokens,
  articles: articlesFromSSR,
  currentArticle,
}) => {
  const router = useRouter();
  const { user } = useUser();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    setInitialArticles,
    articles,
    getArticles,
    noMoreArticles,
    deleteArticle,
  } = useContext(ArticlesContext);

  useEffect(() => {
    if (!articles?.length) setInitialArticles(articlesFromSSR);
  }, [articlesFromSSR, setInitialArticles]);

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch("/api/deleteArticle", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ currentArticle }),
      });

      const json = await response.json();

      if (json.success) {
        deleteArticle(currentArticle);
        router.push("/article/new");
        setShowDeleteConfirm(false);
      }
    } catch (err) {}
  };

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      <div className="flex flex-col text-white overflow-hidden bg-gradient-to-b to-emerald-900 from-cyan-900 px-2">
        <div className="flex flex-wrap gap-2 justify-center">
          <Logo />
          <Link className="button" href="/article/new">
            New post
          </Link>
          <Link
            className="flex-1 text-center hover:text-[#FADBB0] transition-all mt-2 mb-8"
            href="/token"
          >
            <FontAwesomeIcon className="hover:text-[#FADBAD]" icon={faCoins} />
            <span className="pl-2">{availableTokens} tokens available</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto">
          {articles?.map((article) => (
            <Link
              className={`block text-ellipsis overflow-hidden whitespace-nowrap mt-2 py-2 px-4 bg-white/10 hover:bg-white/30 rounded-[5px_0_0_5px] transition-all ${
                currentArticle === article._id &&
                "bg-cyan-100/50 hover:bg-cyan-100/50 text-black font-[500]" +
                  " relative" +
                  " pr-7"
              }`}
              key={article._id}
              href={"/article/" + article._id}
            >
              {article.title}
              {currentArticle === article._id && (
                <button
                  className={
                    "absolute right-0 px-2 hover:text-white transition"
                  }
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              )}
            </Link>
          ))}

          {!noMoreArticles && (
            <div
              className={
                "text-center hover:underline text-sm text-[#FADBAD]/90 mt-3" +
                " cursor-pointer"
              }
              onClick={() =>
                getArticles({
                  lastArticleDate: articles?.[articles.length - 1].created,
                })
              }
            >
              Load more articles
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 border-t border-t-black/50 h-20 px-2">
          {user ? (
            <>
              <div className="min-w-[50px]">
                <Image
                  src={user.picture}
                  alt={user.nickname + " profile image"}
                  height={50}
                  width={50}
                  className="rounded-full"
                />
              </div>
              <div className="font-bold flex-1 flex flex-wrap gap-1">
                <div className="text-sm">{user.email}</div>

                <Link className="text-sm" href="/api/auth/logout">
                  Logout
                </Link>
              </div>
            </>
          ) : (
            <Link href="/api/auth/login">Login</Link>
          )}
        </div>
      </div>
      {children}

      {/* Modal */}
      {showDeleteConfirm && (
        <>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg px-8 py-10 shadow-xl">
              <h2 className="text-2xl font-bold mb-4 mt-0">Confirm Deletion</h2>
              <p className="mb-4">
                Are you sure you want to delete this article? This action is
                irreversible.
              </p>
              <div className="flex justify-end mt-6">
                <button
                  id="cancelBtn"
                  className="mr-2 px-4 py-2 bg-amber-50 text-black font-[500] rounded hover:bg-amber-100 hover:scale-105 transition-all"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  id="confirmBtn"
                  className="px-4 py-2 bg-[#CF6E7C] text-white rounded hover:bg-rose-800 hover:scale-105 transition-all"
                  onClick={handleDeleteConfirm}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 bg-black opacity-50 z-40"></div>
        </>
      )}
    </div>
  );
};
