import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { CiLogin } from "react-icons/ci";

import Button from "~/components/button";
import Spinner from "~/components/spinner";
import createToast from "~/components/toast";
import {
  type Event,
  EventType,
  MyTeamDocument,
  type QueryMyTeamSuccess,
  RegisterSoloEventDocument,
  Role,
} from "~/generated/generated";
import { useAuth } from "~/hooks/useAuth";
import { makeTeamPayment } from "~/utils/razorpay";

import CreateTeamModal from "./createTeamModal";
import JoinTeamModal from "./joinTeamModal";
import TeamCard from "./teamCard";

function EventRegistration({
  eventId,
  type,
  fees,
}: {
  eventId: Event["id"];
  type: Event["eventType"];
  fees: Event["fees"];
}) {
  const { loading, user } = useAuth();
  const router = useRouter();
  const { slug } = router.query;

  if (loading || typeof slug === "undefined" || slug instanceof Array)
    return null;

  return (
    <>
      {/* TODO(Omkar): check these urgent */}
      {eventId === "51" ? (
      <div
        className={`${"border font-semibold italic p-2.5 px-3 border-secondary-500 bg-green-500/10"
        } flex w-full justify-center rounded-full p-1 backdrop-blur-3xl`}
      >
        Exhibition open on all 3 days
      </div >
      ) : eventId === "69" ? (
      <div
        className={`${"border font-semibold text-sm italic p-2.5 px-3 border-secondary-500 bg-green-500/10"
        } flex w-full justify-center rounded-full p-1 backdrop-blur-3xl text-center`}
      >
        Open to only Faculties and Non Teaching Staff
      </div >
      ) :
      !user ? (
        <Link
        as={"/login"}
        href={`/login?redirectUrl=${encodeURIComponent(`/event/${slug}`)}`}
        className="w-fit lg:w-full"
        >
        <button className="mt-1 flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-tr from-secondary-800 to-secondary-600 px-5 py-2 capitalize text-white brightness-100 transition-all duration-300 hover:scale-[1.02] hover:brightness-125">
          <CiLogin />
          Login to Register
        </button>
        </Link>
      ) : (
        <EventRegistrationButton
        userId={user.id}
        registered={user.role !== Role.User}
        eventId={eventId}
        type={type}
        fees={fees}
        name={user.name}
        email={user.email}
        />
      )
      }
    </>
  );
}

export default EventRegistration;

function EventRegistrationButton({
  eventId,
  type,
  fees,
  userId,
  registered,
  name,
  email,
}: {
  eventId: Event["id"];
  type: Event["eventType"];
  fees: Event["fees"];
  userId: string;
  registered: boolean;
  name: string;
  email: string;
}) {
  const { loading, data } = useQuery(MyTeamDocument, {
    variables: {
      eventId: eventId,
    },
  });

  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [registerSoloEvent, { loading: regLoading }] = useMutation(
    RegisterSoloEventDocument,
    {
      refetchQueries: ["MyTeam"],
    },
  );

  const handleSoloRegister = async () => {
    const promise = registerSoloEvent({
      variables: {
        eventId: eventId,
      },
    }).then(async (res) => {
      if (
        res.data?.registerSoloEvent.__typename ===
        "MutationRegisterSoloEventSuccess"
      ) {
        if (fees !== 0) {
          await makeTeamPayment(
            res.data?.registerSoloEvent.data.id,
            name,
            email,
            setSdkLoaded,
          );
        }
      }
    });
    await createToast(promise, "Registering...");
  };

  if (loading)
    return (
      <div className="flex h-20 w-full items-center justify-center">
        <Spinner intent={"white"} />
      </div>
    );

  if (!registered) {
    return (
      <div className="flex h-20 w-full flex-col items-center justify-center space-y-2">
        <p className="text-white">You need to register to join events!</p>
        <Link href={"/register"}>
          <Button
            className="!skew-x-0 !rounded-full"
            intent={"primary"}
            noScaleOnHover
          >
            Register Now
          </Button>
        </Link>
      </div>
    );
  } else if (
    data?.myTeam.__typename === "QueryMyTeamSuccess" &&
    data.myTeam.data
  ) {
    return (
      <TeamCard
        userId={userId}
        name={name}
        email={email}
        team={data.myTeam.data as QueryMyTeamSuccess["data"]}
      />
    );
  } else {
    if (
      type === EventType.Individual ||
      type === EventType.IndividualMultipleEntry
    ) {
      if (fees === 0) {
        return (
          <>
            <Button
              noScaleOnHover
              className="!skew-x-0 justify-center !rounded-full !text-xl"
              onClick={handleSoloRegister}
              fullWidth
              intent={"primary"}
            >
              Register Now
            </Button>
          </>
        );
      } else {
        return (
          <Button
            disabled={regLoading || sdkLoaded}
            onClick={handleSoloRegister}
            fullWidth
            intent={"primary"}
            noScaleOnHover
            className="!skew-x-0 justify-center !rounded-full"
          >
            Pay <span className="font-normal">₹{fees}</span> and Register
          </Button>
        );
      }
    } else {
      return (
        <div className="w-full space-y-2">
          <CreateTeamModal eventId={eventId} />
          <JoinTeamModal />
        </div>
      );
    }
  }
}
