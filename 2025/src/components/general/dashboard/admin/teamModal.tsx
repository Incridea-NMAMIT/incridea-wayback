import { type FC, useState } from "react";

import Button from "~/components/button";
import Modal from "~/components/modal";
import { type EventsQuery, EventType } from "~/generated/generated";
import { idToPid, idToTeamId } from "~/utils/id";

import ViewTeamModal from "./viewTeamModal";

const TeamModal: FC<{
  Team: EventsQuery["events"]["edges"][0];
}> = (Team) => {
  const team = Team?.Team?.node.teams;
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)} intent="secondary">
        Teams
      </Button>
      <Modal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        title={`Teams`}
      >
        <div className="m-3 flex flex-col justify-center">
          <div className="mb-2 hidden flex-row justify-center rounded-lg bg-gray-600 p-2 md:flex">
            {Team?.Team?.node.eventType === EventType.Individual ||
            Team?.Team?.node.eventType === EventType.IndividualMultipleEntry ? (
              <span className="flex basis-1/4 justify-center text-center text-lg font-bold">
                PID
              </span>
            ) : (
              <span className="flex basis-1/4 justify-center text-center text-lg font-bold">
                Team ID
              </span>
            )}
            <span className="flex basis-1/4 justify-center text-center text-lg font-bold">
              Team Name
            </span>
            <span className="flex basis-1/4 justify-center text-center text-lg font-bold">
              Team Status
            </span>
            <span className="flex basis-1/4 justify-center text-center text-lg font-bold">
              Team Details
            </span>
          </div>
          <div className="h-96 overflow-y-auto md:h-64 md:max-h-72">
            {team?.map((team) => (
              <div
                key={team.id}
                className="mb-2 flex flex-col justify-start rounded-lg border border-gray-600 p-2 text-base md:flex-row md:justify-center md:text-lg"
              >
                {Team?.Team?.node.eventType === EventType.Individual ||
                Team?.Team?.node.eventType ===
                  EventType.IndividualMultipleEntry ? (
                  <span className="mb-2 w-full justify-center text-center font-bold md:mb-0 md:w-1/4 md:text-lg">
                    {idToPid(team.members.map((member) => member.user.id)[0]!)}
                  </span>
                ) : (
                  <span className="mb-2 w-full justify-center text-center font-bold md:mb-0 md:w-1/4 md:text-lg">
                    {idToTeamId(team.id)}
                  </span>
                )}
                <span className="mb-2 w-full justify-center text-center font-bold md:mb-0 md:w-1/4 md:text-lg">
                  {team?.name}
                </span>
                <span
                  className={`mb-2 w-full justify-center text-center font-bold md:mb-0 md:w-1/4 md:text-lg ${team.confirmed ? "text-green-500" : "text-red-500"}`}
                >
                  {team?.confirmed ? "Confirmed" : "Not Confirmed"}
                </span>
                <span className="flex w-full justify-center text-center font-bold md:w-1/4 md:text-lg">
                  <ViewTeamModal members={team.members} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TeamModal;
