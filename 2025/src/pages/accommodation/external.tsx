import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { TbArrowBackUp } from "react-icons/tb";

import Button from "~/components/button";
import Loader from "~/components/loader";
import { CONSTANT } from "~/constants";
import { ASSETS } from "~/constants/assets";
import { useAuth } from "~/hooks/useAuth";

const Accommodation: NextPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user) {

    void router.push("/login");
    return <>
      Redirecting...
    </>
  }

  if (user.college?.id == `${CONSTANT.NMAMIT_COLLEGE_ID}`) {

    void router.push("/profile");
    void router.push("/login");
    return <>
      Redirecting...
    </>
  }

  return (
    <>
      <div className="min-h-screen px-4 pb-10 pt-32 text-white md:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="p-4">
            <Link href="/accommodation">
              <Button size={"small"}>
                <TbArrowBackUp />
                Go Back
              </Button>
            </Link>
          </div>

          <h2 className={`text-center text-4xl text-white md:text-5xl`}>
            External Accommodation
          </h2>
          <h5 className="mx-auto mt-5 max-w-7xl text-center text-base md:mt-7 md:text-xl">
            Before you make the next move, read through the list of T&C, and
            register yourself for the external accommodation.
          </h5>

          <div className="mx-auto mt-6 max-w-7xl rounded-sm bg-white/20 px-5 py-4 md:mt-8 md:px-10 md:py-7">
            <h2 className="mb-1 text-base font-semibold md:text-2xl">
              Terms and Conditions
            </h2>

            <ol className="mt-2 list-decimal pl-4">
              <li>
                If you have chosen external accommodation, please find the excel
                sheet provided with detail regarding the same.
              </li>
              <li>
                You are to choose the hotel of your choice from the sheet and
                contact them for booking; once you have confirmed the booking,
                you must contact the Point of Contact given below and inform
                them regarding the same.
              </li>
              <li>
                For any further clarifications regarding the same and transport
                from the place of accommodation, contact: +918618378701, +919611878045{" "}
              </li>
              <li>
                External Accommodation Details:{" "}
                <Link
                  href={ASSETS.PUBLIC.EXTERNAL_ACCOMMODATION}
                  target="_blank"
                  className="underline"
                  download
                >
                  Accommodation Details Excel Sheet
                </Link>{" "}
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};

export default Accommodation;
