import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/app-layout/app-layout";

export default function TokenTopup() {
  return (
    <div>
      <h1>This is the token topup</h1>
    </div>
  );
}

TokenTopup.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {},
  };
});
