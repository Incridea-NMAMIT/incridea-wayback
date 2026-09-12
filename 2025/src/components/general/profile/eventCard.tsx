import Image from "next/image";
import { useRouter } from "next/router";
import { QRCodeSVG } from "qrcode.react";
import React, { type FC } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { RiNumbersLine } from "react-icons/ri";

import { idToPid, idToTeamId } from "~/utils/id";

import ConfirmTeamModal from "./confirmTeam";
import DeleteTeamModal from "./deleteTeam";
import EditTeamModal from "./editTeam";
import {
  EventType,
  type RegisterdEventsQuery,
} from "~/generated/generated";
import { CONSTANT } from "~/constants";

const EventCard: FC<{
  teams: Extract<RegisterdEventsQuery["registeredEvents"],
    { __typename: "QueryRegisteredEventsSuccess" }
  >["data"][number]["teams"];
  event: Extract<RegisterdEventsQuery["registeredEvents"],
    { __typename: "QueryRegisteredEventsSuccess" }
  >["data"][number];
  userId: string;
}> = ({ teams, event, userId }) => {
  const eventType = event.teams.map((team) => team.event.eventType)[0];
  const solo =
    eventType === EventType.Individual ||
    eventType === EventType.IndividualMultipleEntry;

  const router = useRouter();

  return (
    <div
      onClick={() =>
        router.push(
          `/event/${event.name.toLowerCase().replaceAll(" ", "-")}-${event.id}`,
        )
      }
      key={event.id}
      className="flex w-[19rem] cursor-pointer items-start justify-evenly rounded-lg border border-primary-200/70 bg-primary-400 p-5 transition-transform duration-300 hover:scale-[1.02]"
    >
      <div className="flex flex-col items-center justify-center">
        <div className="relative">
          <Image
            src={event.image ?? CONSTANT.ASSETS.PUBLIC.LOGO_RIM}
            alt={event.name}
            height={300}
            width={300}
            className="rounded-xl"
          />
          <h1 className="absolute bottom-0 w-full rounded-xl bg-gradient-to-t from-black to-transparent pb-3 text-center text-sm font-bold text-white md:text-xl">
            {event.name}
          </h1>
        </div>
        <div className="mt-4 flex w-full flex-col items-center justify-end px-5">
          <div className="flex flex-wrap justify-between gap-2 text-gray-200">
            <div className="flex w-full items-center justify-center gap-2 rounded-full border border-secondary-400/40 bg-primary-200/30 px-3 py-1 text-left">
              <IoLocationOutline />
              <p className="truncate text-xs font-medium md:text-sm">
                {event?.venue}
              </p>
            </div>
            <div className="flex w-full items-center justify-center gap-2 rounded-full border border-secondary-400/40 bg-primary-200/30 px-3 py-1 text-left">
              <RiNumbersLine />
              <p className="text-center text-xs font-medium md:text-sm">
                {event?.rounds.length} Round{event?.rounds.length > 1 && "s"}
              </p>
            </div>
          </div>

          {teams?.map((team, i) => (
            <div
              key={i}
              className="mt-5 flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-primary-200/80 p-3"
            >
              <div className="flex items-center gap-5">
                <QRCodeSVG
                  color="#ffffff"
                  fgColor="#ffffff"
                  value={solo ? idToPid(userId) : idToTeamId(team.id)}
                  size={75}
                  bgColor="transparent"
                />
                <div className="flex flex-col justify-between gap-2 text-white">
                  <p className="cursor-pointer text-sm font-bold text-white lg:text-lg">
                    {solo ? idToPid(userId) : idToTeamId(team.id)}
                  </p>

                  {!team.confirmed && (
                    <div className="flex items-start">
                      {!solo && team.leaderId?.toString() == userId && (
                        <EditTeamModal userId={userId} team={team} />
                      )}
                      {solo && (
                        <DeleteTeamModal
                          teamId={team.id}
                          solo={solo}
                          isLeader={team.leaderId?.toString() == userId}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col-reverse">
                <div className="flex justify-start">
                  {!team.confirmed &&
                    Number(team.leaderId) === Number(userId) && (
                      <ConfirmTeamModal
                        teamId={team.id}
                        canConfirm={
                          team.members.length >= team.event.minTeamSize
                        }
                        needMore={team.event.minTeamSize - team.members.length}
                      />
                    )}
                </div>
                <div className="mt-1 w-fit overflow-hidden text-ellipsis rounded-full border border-primary-200/80 px-3 py-1 text-center text-sm text-white">
                  {team.confirmed ? (
                    <p>{solo ? "You are " : "Your team is "} confirmed!</p>
                  ) : (
                    <p>
                      {solo ? "You are " : "Your team is "} not confirmed yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
