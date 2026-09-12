import { Tab } from "@headlessui/react";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";

import { type EventByOrganizerQuery } from "~/generated/generated";

import AddParticipantModal from "./addParticipantModal";
import AddTeamModal from "./addTeamModal";
import ScanModal from "./scanModal";
import Teams from "./teams";

function RoundsTab({
  rounds,
  eventId,
  eventType,
}: {
  rounds: Extract<EventByOrganizerQuery["eventByOrganizer"], {
    __typename: "QueryEventByOrganizerSuccess"
  }>["data"][number]["rounds"];
  eventId: string;
  eventType: string;
}) {
  const [searchParam, setSearchParam] = useState("");

  return (
    <div className="flex h-full flex-col gap-3 md:flex-row">
      <Tab.Group className="flex flex-col w-full gap-3 lg:flex-row">
        <Tab.List className="flex w-full flex-row items-center justify-center gap-2 overflow-x-auto border-gray-600 bg-gray-900/30 p-3 backdrop-blur-md sm:rounded-lg sm:border md:max-w-xs md:flex-col">
          {rounds.map((round) => (
            <Tab key={round.roundNo} className="focus:outline-none md:w-full">
              {({ selected }) => (
                /* Use the `selected` state to conditionally style the selected tab. */
                <button
                  className={`w-full whitespace-nowrap rounded-lg px-3 py-2 ${selected
                      ? "bg-blue-900/40 text-white"
                      : "bg-gray-600/40 text-gray-300"
                    }`}
                >
                  Round {round.roundNo}
                </button>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="relative w-full grow overflow-y-auto rounded-lg border-gray-600 bg-gray-900/30 backdrop-blur-md sm:border">
          {rounds.map((event) => (
            <Tab.Panel key={event.roundNo}>
              {/* search bar  */}
              <div className="sticky top-0 z-10 mb-4 flex flex-col-reverse gap-2 bg-gray-900 p-3 md:flex-row">
                <div className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gray-600/40 p-1">
                  <input
                    value={searchParam}
                    onChange={(e) => {
                      setSearchParam(e.target.value);
                    }}
                    type="text"
                    className="w-full rounded-xl bg-transparent p-2 text-white outline-none"
                    placeholder="Search by team name"
                  />
                  <BiSearch className="mx-2 text-2xl text-white" />
                </div>
                <ScanModal eventId={eventId} eventType={eventType} />
                {eventType === "INDIVIDUAL" ||
                  eventType === "INDIVIDUAL_MULTIPLE_ENTRY" ? (
                  <AddParticipantModal eventId={eventId} />
                ) : (
                  <AddTeamModal eventId={eventId} />
                )}
              </div>
              <div className="-mt-5 max-h-screen overflow-y-auto p-3 sm:max-h-[70vh]">
                <Teams
                  eventType={eventType}
                  contains={searchParam}
                  roundNo={event.roundNo}
                  eventId={event.eventId}
                />
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default RoundsTab;
