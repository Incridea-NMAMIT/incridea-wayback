import { useQuery } from "@apollo/client";
import { Bed, LogOut } from "lucide-react";
import { type NextPage } from "next";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import toast from "react-hot-toast";

import Button from "~/components/button";
import ViewUserAccommodation from "~/components/general/profile/viewUserAccommodation";
import Loader from "~/components/loader";
import { CONSTANT } from "~/constants";
import { GetRegistrationsOpenDocument, Role } from "~/generated/generated";
import { AuthStatus, useAuth } from "~/hooks/useAuth";
import { makePayment } from "~/utils/razorpay";

const Register: NextPage = () => {
  const { user, loading: userLoading, status: useStatus } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState<boolean>(false);

  const { data: registrationData, loading: registrationLoading } = useQuery(
    GetRegistrationsOpenDocument,
  );

  if (userLoading) return <Loader />;

  if (!user) {
    void router.push("/login")
    return <Loader />
  }

  if (user.role !== Role.User) {
    void router.push("/profile")
    return <Loader />
  }

  return (
    <div className="min-h-screen px-4 pb-10 pt-32 text-white md:px-6">
      <ViewUserAccommodation
        showModal={showModal}
        setShowModal={setShowModal}
      />
      <div className="mx-auto max-w-4xl">
        <h2
          className={`text-center text-4xl text-white md:text-6xl font-life-craft tracking-wider`}
        >
          Register
        </h2>

        <h5 className="mx-auto mt-5 max-w-7xl text-center text-base md:mt-7 md:text-xl">
          Before you enter the portal, read through the list of T&C, and
          register yourself for the fest by clicking the button below.
        </h5>
        <div className="mx-auto mt-6 max-w-7xl rounded-sm bg-white/20 px-5 py-4 md:mt-8 md:px-10 md:py-7">
          <div className="flex w-full justify-between items-center">
            <h2 className="text-base font-semibold md:text-2xl">
              Terms and Conditions
            </h2>
            <Button
              intent={"danger"}
              className="flex gap-2"
              onClick={async () => {
                toast.loading("Logging out...");
                await signOut();
                toast.success("Logged out successfully");
              }}
            >
              <LogOut />
            </Button>
          </div>
          <p className="mt-2 mb-4">
            Two different categories of participants are permitted to
            participate:
          </p>
          <ol className="mt-2 list-decimal space-y-4 pl-4">
            <li>
              {" "}
              Students of <u>NMAM Institute of Technology</u>, who pay{" "}
              <span className="font-semibold">
                ₹{CONSTANT.REG_AMOUNT_IN_INR.INTERNAL}(+2.22% Razorpay charges)
              </span>{" "}
              will have access to all events and pronites
            </li>
            <li>
              {" "}
              Students of external <u>Engineering and Sister Nitte colleges</u>,
              who pay{" "}
              <span className="font-semibold">
                ₹{CONSTANT.REG_AMOUNT_IN_INR.EXTERNAL}(+2.22% Razorpay charges)
              </span>{" "}
              will have access to all events and pronites.
            </li>
          </ol>
          <div className="mt-4">
            <Link
              className="underline hover:text-gray-300"
              href={"/guidelines"}
            >
              Read More
            </Link>{" "}
            about the guidelines and regulations
          </div>

          <div className="flex flex-col-reverse justify-between items-center my-4 gap-4 md:flex-row">
            {registrationLoading || !registrationData ?
              <Button intent="info">
                Loading...
              </Button>
              : registrationData.getRegistrationsOpen.__typename === "Error" ?
                <Button
                  className="flex gap-2"
                  disabled>Unexpected error occured</Button>
                : registrationData.getRegistrationsOpen.data ? (
                  <Button
                    className="flex gap-2"
                    onClick={() => makePayment()}
                  >
                    Register Now
                  </Button>
                ) : (
                  <Button
                    className="flex gap-2"
                    disabled
                  >
                    Registrations are closed.
                  </Button>
                )}
            {useStatus === AuthStatus.AUTHENTICATED && user.college && user.college.id !== "1" &&
              <Link href="/accommodation">
                <Button className="flex gap-2" >
                  <Bed />
                  Accomodation
                </Button>
              </Link>
            }
          </div>

          <h1 className="mt-2 text-xs text-gray-100 md:text-sm">
            By clicking the above button, you agree to the mentioned terms and
            conditions
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Register;
