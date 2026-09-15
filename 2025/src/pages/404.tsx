import { type NextPage } from "next";
import Link from "next/link";

import Button from "~/components/button";

const Page404: NextPage = () => {
  const titleText = "Timeline Corrupted!";
  const bodyText = "Looks like you've fractured the time continuum.";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-9xl font-black text-white/30">404</div>
      <div className="flex flex-col items-center justify-center">
        <h1
          className={`mx-2 mb-1 flex items-center justify-center text-center text-2xl font-bold text-white transition-colors duration-300 md:mb-3 md:text-5xl`}
        >
          {titleText}
        </h1>
        <h1
          className={`mx-2 flex items-center justify-center text-center text-sm text-gray-200 transition-colors duration-300 md:text-lg`}
        >
          {bodyText}{" "}
        </h1>
        <Link href={"/"} as="/">
          <Button className="mt-4" intent={"primary"}>
            Return to Main Menu
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Page404;
