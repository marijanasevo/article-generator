import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/app-layout/app-layout";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { getAppProps } from "../../utils/getAppProps";

export default function Article(props) {
  return (
    <div className="overflow-auto h-full">
      <div className="max-w-screen-sm mx-auto">
        <div className="text-sm font-bold mt-6 p-2 bg-amber-50 rounded-sm">
          SEO title and meta description
        </div>
        <div className="p-4 my-2 border border-amber-100 rounded-md">
          <div className={"text-cyan-800 text-2xl font-bold"}>
            {props.title}
          </div>
          <div className={"mt-3"}>{props.metaDescription}</div>
        </div>

        <div className="text-sm font-bold mt-6 p-2 bg-amber-50 rounded-sm">
          Keywords
        </div>

        <div className={"flex flex-wrap pt-2 gap-1"}>
          {props.keywords.split(",").map((keyword, i) => (
            <div
              className={
                "bg-cyan-900 text-white py-2 px-4 rounded-full text-sm"
              }
              key={i}
            >
              <FontAwesomeIcon icon={faHashtag} /> {keyword}
            </div>
          ))}
        </div>

        <div className="text-sm font-bold mt-6 p-2 bg-amber-50 rounded-sm">
          Article content
        </div>

        <div dangerouslySetInnerHTML={{ __html: props.articleContent || "" }} />
      </div>
    </div>
  );
}

Article.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    const userSession = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db("ArticleGenerator");
    const user = await db.collection("users").findOne({
      auth0Id: userSession.user.sub,
    });

    const article = await db.collection("articles").findOne({
      _id: new ObjectId(ctx.params.articleId),
      userId: user._id,
    });

    if (!article) {
      return {
        redirect: {
          destination: "/article/new",
          permanent: false,
        },
      };
    }

    return {
      props: {
        articleContent: article.articleContent,
        title: article.title,
        metaDescription: article.metaDescription,
        keywords: article.keywords,
        ...props,
      },
    };
  },
});
