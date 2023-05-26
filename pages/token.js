import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/app-layout/app-layout";
import { getAppProps } from "../utils/getAppProps";

export default function Token() {
  const handleAddTokens = async () => {
    const response = await fetch("/api/add-tokens", {
      method: "POST",
    });
  };

  return (
    <div>
      <h1>This is the token page</h1>
      <button
        className="button w-auto bg-cyan-900 hover:bg-[#CF6E7C] hover:text-white"
        onClick={handleAddTokens}
      >
        Get tokens
      </button>
    </div>
  );
}

Token.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);

    return {
      props,
    };
  },
});
