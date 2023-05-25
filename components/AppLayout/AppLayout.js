import Image from "next/image";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";

export const AppLayout = ({ children }) => {
  const { user } = useUser();

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      <div className="flex flex-col text-white overflow-hidden bg-gradient-to-b from-emerald-900 to-cyan-800">
        <div>
          <div>logo</div>
          <div>cta new post</div>
          <div>tokens</div>
        </div>
        <div className="flex-1 overflow-auto">list of posts</div>
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
      <div>{children}</div>
    </div>
  );
};
