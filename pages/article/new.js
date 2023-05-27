import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/app-layout/app-layout";
import { useState } from "react";
import { useRouter } from "next/router";
import { getAppProps } from "../../utils/getAppProps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndustry } from "@fortawesome/free-solid-svg-icons";

export default function NewArticle() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let response;

    try {
      response = await fetch("/api/generate-article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, keywords }),
      });
    } catch (err) {
      console.log(err);
      setLoading(false);
    }

    const json = await response.json();
    if (json?.articleId) router.push("/article/" + json.articleId);
  };

  return (
    <div className={"h-full overflow-hidden"}>
      {!loading ? (
        <div className={"w-full h-full flex flex-col overflow-auto"}>
          <form
            onSubmit={handleSubmit}
            className={"m-auto w-full max-w-screen-sm p-5 shadow-xl"}
          >
            <div>
              <label>
                <strong className={"text-cyan-900"}>
                  I need an article on the subject of:
                </strong>
                <textarea
                  className="textarea-input"
                  value={subject}
                  maxLength={100}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                <strong className={"text-cyan-900"}>
                  That targets the following keywords:
                </strong>
                <textarea
                  className="textarea-input"
                  value={keywords}
                  maxLength={100}
                  onChange={(e) => setKeywords(e.target.value)}
                />
                <small className={"mb-3.5 block"}>
                  Separate keywords with a comma
                </small>
              </label>
            </div>
            <button
              disabled={!subject.trim() || !keywords.trim()}
              type="submit"
              className="button bg-[#FADBB0] text-emerald-900 hover:bg-[#CF6E7C] hover:text-white"
            >
              Generate
            </button>
          </form>
        </div>
      ) : (
        <div
          className={
            "animate-pulse flex h-full m-auto flex-col" +
            " justify-center text-center"
          }
        >
          <FontAwesomeIcon
            className={"text-8xl text-cyan-900 "}
            icon={faIndustry}
          />
          <p>We&apos;re writing the article for you!</p>
        </div>
      )}
    </div>
  );
}

NewArticle.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);

    if (!props.availableTokens) {
      return {
        redirect: {
          destination: "/token",
          permanent: false,
        },
      };
    }

    return {
      props,
    };
  },
});
