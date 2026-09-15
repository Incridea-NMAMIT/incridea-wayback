import Image from "next/image";
import { useRouter } from "next/router";
import { QRCodeSVG } from "qrcode.react";
import React, { type FC } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { RiNumbersLine } from "react-icons/ri";

import { idToPid, idToTeamId } from "~/utils/id";

import {
  EventType,
  type RegisterdEventsQuery,
} from "~/generated/generated";
import EditTeamModal from "~/components/general/profile/editTeam";
import DeleteTeamModal from "~/components/general/profile/deleteTeam";
import ConfirmTeamModal from "~/components/general/profile/confirmTeam";
import LeaveTeamModal from "../general/profile/leaveTeamModal";
import { CONSTANT } from "~/constants";

const EventCard: FC<{
  teams: Extract<RegisterdEventsQuery["registeredEvents"],
    { __typename: "QueryRegisteredEventsSuccess" }
  >["data"][number]["teams"];
  event: Extract<RegisterdEventsQuery["registeredEvents"],
    { __typename: "QueryRegisteredEventsSuccess" }
  >["data"][number];
  userId: string;
  isCompleted: boolean;
}> = ({ teams, event, userId, isCompleted }) => {
  const eventType = event.teams.map((team) => team.event.eventType)[0];
  const solo =
    eventType === EventType.Individual ||
    eventType === EventType.IndividualMultipleEntry;

  const router = useRouter();

  return (
    <div className="flex flex-col h-fit items-center mx-auto justify-center text-black bg-gradient-to-r from-primary-950/50 to-primary-950/50 via-primary-800 w-fit p-4 rounded-xl shadow-lg shadow-black/80 border border-secondary-300">
      <div className="flex flex-col items-center justify-center text-black">
        <div className="relative">
          <Image
            src={event.image ?? CONSTANT.ASSETS.PUBLIC.LOGO_RIM}
            alt={event.name}
            height={300}
            width={300}
            className="rounded-md"
          />
          <h1
            onClick={async () =>
              await router.push("/event/" + event.id.toString())
            }
            className="absolute cursor-pointer underline bottom-0 w-full rounded-xl bg-gradient-to-t from-black to-transparent pb-3 text-center text-sm font-bold text-white md:text-xl"
          >
            {event.name}
          </h1>
        </div>
        <div className="mt-4 flex w-full flex-col items-center justify-end px-5">
          <div className="flex flex-wrap justify-between gap-2 text-black/80">
            <div className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-secondary-600 to-secondary-600 via-secondary-300 px-3 py-1 text-left">
              <IoLocationOutline />
              <p className="truncate text-xs font-medium md:text-sm">
                {event?.venue}
              </p>
            </div>
            <div className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-secondary-600 to-secondary-600 via-secondary-300 px-3 py-1 text-left">
              <RiNumbersLine />
              <p className="text-center text-xs font-medium md:text-sm">
                {event?.rounds.length} Round{event?.rounds.length > 1 && "s"}
              </p>
            </div>
          </div>

          {teams?.map((team, i) => (
            <div
              key={i}
              className="mt-5 flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-secondary-300 p-3"
            >
              <div className="flex items-center gap-5">
                {/* QR code color white */}
                <QRCodeSVG
                  color="#ffffff"
                  fgColor="#ffffff"
                  value={solo ? idToPid(userId) : idToTeamId(team.id)}
                  size={75}
                  bgColor="transparent"
                />
                <div className="flex flex-col justify-evenly items-center gap-2 text-black">
                  <p className="cursor-pointer text-sm font-bold text-primary-300 lg:text-lg">
                    {solo ? idToPid(userId) : idToTeamId(team.id)}
                  </p>
                  <p className="text-secondary-300 font-semibold text-sm border-2 border-secondary-500 rounded-full px-2">
                    {isCompleted
                      ? "Completed"
                      : team.confirmed
                        ? "Confirmed"
                        : "Pending"}
                  </p>
                </div>
              </div>

              {!team.confirmed && (
                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex flex-row flex-nowrap gap-2">
                    <EditTeamModal userId={userId} team={team} />
                    {team.leaderId?.toString() === userId ? (
                      <DeleteTeamModal
                        teamId={team.id}
                        solo={solo}
                        isLeader={team.leaderId?.toString() === userId}
                      />
                    ) : (
                      <LeaveTeamModal refetch="MyTeam" teamId={team.id} />
                    )}
                  </div>
                  {team.leaderId?.toString() === userId && (
                    <ConfirmTeamModal
                      teamId={team.id}
                      canConfirm={team.members.length >= team.event.minTeamSize}
                      needMore={team.event.minTeamSize - team.members.length}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
