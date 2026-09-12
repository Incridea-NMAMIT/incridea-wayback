import { useQuery } from "@apollo/client";
import { type FC } from "react";

import Badge from "~/components/badge";
import ViewEventModal from "~/components/general/dashboard/organizer/viewEventModal";
import Spinner from "~/components/spinner";
import { EventsByBranchRepDocument } from "~/generated/generated";

import AddEventModal from "./addEventModal";
import AddOrganizerModal from "./addOrganizerModal";
import DeleteEvent from "./deleteEvent";

const EventList: FC<{
  branchRepId: string;
}> = ({ branchRepId }) => {
  // Get Events Query
  const {
    data: events,
    loading: eventsLoading,
    refetch: eventsRefetch,
  } = useQuery(EventsByBranchRepDocument, {
    variables: {
      branchRepId: branchRepId,
    },
  });

  // Get Branch Name
  const branch =
    events?.eventsByBranchRep.__typename === "QueryEventsByBranchRepSuccess"
      ? events.eventsByBranchRep.data.find((event) => event.branch.name)?.branch
          .name
      : undefined;

  return (
    <>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl">Registered Events</h1>
          {branch && <Badge color={"success"}>{branch}</Badge>}
        </div>
        <AddEventModal eventsRefetch={eventsRefetch} />
      </div>
      <div className="mt-5 flex flex-col gap-3 md:gap-0.5">
        {/* Event Header */}
        <div className="hidden items-center justify-between gap-5 rounded-t-lg bg-white bg-opacity-20 bg-clip-padding p-2 text-2xl font-bold backdrop-blur-lg backdrop-filter md:flex">
          <h1 className="basis-1/5 py-2.5 pl-4 text-start">Event Name</h1>
          <h1 className="basis-1/5 py-2.5 text-center">Type</h1>
          <h1 className="basis-1/5 py-2.5 text-center">Status</h1>
          <h1 className="basis-1/5 py-2.5 text-center">Preview</h1>
          <h1 className="basis-1/5 py-2.5 text-center">Edit Organizers</h1>
          <h1 className="basis-1/5 py-2.5 pr-5 text-end">Delete</h1>
        </div>

        {eventsLoading && (
          <div className="mt-10 flex items-center justify-center">
            <Spinner className="text-gray-300" />
          </div>
        )}

        {/* Events list */}
        {events?.eventsByBranchRep.__typename ===
          "QueryEventsByBranchRepSuccess" &&
          events.eventsByBranchRep.data.map((event, i, arr) => (
            <div
              key={event.id}
              className={`bg-white/10 ${
                i === arr.length - 1 && "md:rounded-b-lg"
              } flex flex-col items-start justify-between gap-3 rounded-lg p-3 md:flex-row md:items-center md:gap-5 md:rounded-none md:p-5`}
            >
              <h1 className="inline-flex flex-wrap gap-2 overflow-x-auto text-start text-xl font-bold md:basis-1/5">
                {event.name}{" "}
                <span className="block text-lg font-light md:hidden">
                  ({event.eventType})
                </span>
              </h1>
              <h1 className="hidden text-center text-lg md:block md:basis-1/5">
                {event.eventType}
              </h1>
              <div className="text-center md:basis-1/5">
                <h1
                  className={`mx-auto w-fit rounded-full border px-3 text-center leading-7 ${
                    event.published
                      ? "border-green-500 text-green-500"
                      : "border-red-500 text-red-500"
                  }`}
                >
                  {event.published ? "Published" : "Pending"}
                </h1>
              </div>
              <ViewEventModal event={event} />
              <div className="text-center md:basis-1/5">
                <AddOrganizerModal
                  eventId={event.id}
                  organizers={event.organizers}
                  eventsRefetch={eventsRefetch}
                  eventName={event.name}
                />
              </div>
              <div className="text-end md:basis-1/5">
                <DeleteEvent eventId={event.id} published={event.published} />
              </div>
            </div>
          ))}
        {events?.eventsByBranchRep.__typename ===
          "QueryEventsByBranchRepSuccess" &&
          events.eventsByBranchRep.data.length === 0 && (
            <div className="rounded-md bg-white/10 p-10 text-center text-xl italic text-gray-300 md:rounded-t-none">
              No events found
            </div>
          )}
      </div>
    </>
  );
};

export default EventList;
