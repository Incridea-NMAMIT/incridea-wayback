import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { TbArrowBackUp } from "react-icons/tb";

import Button from "~/components/button";
import Loader from "~/components/loader";
import { useAuth } from "~/hooks/useAuth";

const Accommodation: NextPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  if (!user) {
    void router.push("/login");
    return <>Redirecting...</>;
  }

  if (user?.college?.id == "1") {
    void router.push("/profile");
    return <>Redirecting...</>;
  }

  return (
    <>
      <div className="min-h-screen  px-4 pb-10 pt-32 text-white md:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="p-4">
            <Link href="/profile">
              <Button size={"small"}>
                <TbArrowBackUp />
                Go Back
              </Button>
            </Link>
          </div>

          <h2 className={`text-center text-4xl text-white md:text-5xl`}>
            Choose your Accommodation
          </h2>
          <h5 className="mx-auto mt-5 max-w-7xl text-center text-base md:mt-7 md:text-xl">
            Before you travel thru time and choose your destination
          </h5>

          <div className="mx-auto mt-6 flex max-w-7xl flex-col items-center justify-evenly gap-5 rounded-xl bg-white/20 px-5 py-4 md:mt-8 md:flex-row md:px-10 md:py-7">
            <Link href="/accommodation/internal">
              <Button>Internal Accommodation</Button>
            </Link>
            <Link href="/accommodation/external">
              <Button>External Accommodation</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Accommodation;
