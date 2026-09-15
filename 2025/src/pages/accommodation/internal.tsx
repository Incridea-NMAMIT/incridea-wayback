import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { TbArrowBackUp } from "react-icons/tb";

import Button from "~/components/button";
import AccommodationForm from "~/components/form/accommodation";
import Loader from "~/components/loader";
import { CONSTANT } from "~/constants";
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
            Internal Accommodation
          </h2>
          <h5 className="mx-auto mt-5 max-w-7xl text-center text-base md:mt-7 md:text-xl">
            Before you make the next move, read through the list of T&C, and
            register yourself for the internal accommodation by filling the form
            below.
          </h5>

          <div className="mx-auto mt-6 max-w-7xl rounded-sm bg-white/20 px-5 py-4 md:mt-8 md:px-10 md:py-7">
            <h2 className="mb-1 text-base font-semibold md:text-2xl">
              Terms and Conditions
            </h2>

            <h3 className="mt-5 text-xl font-bold">
              Rules to be followed by external students (Boys)
            </h3>
            <ol className="mt-2 list-decimal pl-4">
              <li>
                Main Boys Hostel is assigned for boys, which will be closed within half an hour from the time the programs end at Night.
              </li>
              <li>
                Rooms provided will be of 3-sharing system. Per head charges for the same is 200 per day.
              </li>
              <li>
                Consumption of alcohol or any similar substances is strictly prohibited and strict action will be taken if found guilty of the same.
              </li>
              <li>
                If found guilty of damaging any of the resources or property of college strict action will be taken.
              </li>
              <li>
                Participants are advised to bring their own locks to ensure the protection of their belongings in the rooms.
              </li>
              <li>Do not litter the rooms provided.</li>
            </ol>

            <h3 className="mt-5 text-xl font-bold">
              Rules to be followed by external students (Girls)
            </h3>
            <ol className="mt-2 list-decimal pl-4">
              <li>
                EDC Block is assigned for girls, which will be closed within half an hour from the time the programs end at Night.
              </li>
              <li>
                Rooms provided will be of 3-sharing system. Per head charges for the same is 200 per day.
              </li>
              <li>
                A dormitory is also available with a capacity of 20. Per head charges for the same is 200 per day.
              </li>
              <li>
                Consumption of alcohol or any similar substances is strictly prohibited and will result in severe consequences being taken.
              </li>
              <li>
                The security will open EDC at 6 am in the morning, so if you want anything during the night time, you cannot go out and hence it is advised to carry the necessary things well in advance.
              </li>
              <li>
                Do not damage the resources provided from college. If found guilty, strict action will be taken.
              </li>
              <li>
                Participants are advised to bring their own locks to ensure the protection of their belongings in the dormitory.
              </li>
              <li>Do not litter the dormitory.</li>
            </ol>

            <div className="mt-2">
              <Link
                className="underline hover:text-gray-300"
                href={"/guidelines"}
              >
                Read More
              </Link>{" "}
              about the guidelines and regulations
            </div>

            <div className="flex justify-center">
              <AccommodationForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Accommodation;
