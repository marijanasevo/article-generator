import Image from "next/image";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { Logo } from "../logo/logo";

export const AppLayout = ({
  children,
  availableTokens,
  articles,
  currentArticle,
}) => {
  const { user } = useUser();

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      <div className="flex flex-col text-white overflow-hidden bg-gradient-to-b to-emerald-900 from-cyan-900 px-2">
        <div className="flex flex-wrap gap-2 justify-center">
          <Logo />
          <Link className="button" href="/article/new">
            New post
          </Link>
          <Link className="flex-1 text-center" href="/token">
            <FontAwesomeIcon className="text-[#FADBAD]" icon={faCoins} />
            <span className="pl-2">{availableTokens} tokens available</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto">
          {articles.map((article) => (
            <Link
              className={`block text-ellipsis overflow-hidden whitespace-nowrap mt-2 py-2 px-4 bg-white/10 hover:bg-white/30 rounded-[5px_0_0_5px] transition-all ${
                currentArticle === article._id &&
                "bg-cyan-100/50 hover:bg-cyan-100/50 text-black"
              }`}
              key={article._id}
              href={"/article/" + article._id}
            >
              {article.title}
            </Link>
          ))}
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
    </div>
  );
};
