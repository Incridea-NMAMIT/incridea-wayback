import { useQuery } from "@apollo/client";
import { type FC } from "react";

import Badge from "~/components/badge";
import Spinner from "~/components/spinner";
import { EventsDocument } from "~/generated/generated";
import { BranchesDocument } from "~/generated/generated";

import AddBranchModal from "./addBranchModal";
import AddBranchRep from "./addBranchRep";
import CollegesModal from "./collegesModal";
import PublishEventModal from "./publishEventModal";
import RoundsDone from "./roundsDone";
import SearchUsersModal from "./searchUsersModal";
import ViewEvent from "./viewEventModal";
import RegistrationToggle from "~/components/general/dashboard/admin/registrationToggle";
import Button from "~/components/button";
import Link from "next/link";

const AdminTab: FC<{
  AdminId: string;
}> = ({ }) => {
  const first = 200;
  const { data: branches, loading: branchesLoading } = useQuery(
    BranchesDocument,
    {},
  );

  const { data: events, loading: eventsLoading } = useQuery(EventsDocument, {
    variables: {
      first: first,
    },
  });

  return (
    <>
      <div>
        {/* Admin Header */}
        <div className="mt-6 flex flex-col gap-4 md:flex-row items-center justify-between text-center md:m-3">
          <RegistrationToggle />
          <Link href="/dashboard/analytics">
            <Button intent={"info"}>
              Analytics
            </Button>
          </Link>
          <div className="flex gap-4">
            <div className="mx-3 flex items-center justify-center">
              <SearchUsersModal />
            </div>
            <div className="flex items-center justify-center">
              <CollegesModal />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 md:flex-row md:justify-between">
          <div className="mt-5 flex basis-2/3 flex-col justify-center gap-1 md:gap-0.5">
            <div className="ml-2 flex items-center gap-3">
              <h1 className="text-2xl">Events</h1>
            </div>
            <div className="ml-2 hidden h-20 items-center justify-between gap-2.5 rounded-t-lg bg-white bg-opacity-20 bg-clip-padding p-1 text-lg font-bold backdrop-blur-lg backdrop-filter md:flex">
              <h1 className="basis-1/5 py-2.5 pl-2 text-start">Event Name</h1>
              <h1 className="basis-1/5 py-2.5 pr-2 text-center">Branch Name</h1>
              <h1 className="basis-1/5 py-2.5 text-center">Rounds Done</h1>
              <h1 className="basis-1/5 py-2.5 pr-4 text-center">Status</h1>
              <h1 className="basis-1/5 py-2.5 pr-5 text-center">Publish</h1>
              <h1 className="basis-1/5 py-2.5 pr-5 text-center">View</h1>
            </div>
            {eventsLoading && (
              <div className="mt-10 flex items-center justify-center">
                <Spinner className="text-gray-300" />
              </div>
            )}
            <div className="max-h-80 md:max-h-screen w-full overflow-y-auto text-center md:h-[500px]">
              {Array.from(events?.events?.edges ?? []).sort((a, b) => a.node.name < b.node.name ? -1 : 1)?.map((event, i) => (
                <div
                  key={i}
                  className={`mb-3 ml-2 flex flex-col items-start rounded-lg bg-white/10 p-3 md:my-0 md:flex-row md:items-center md:justify-center md:rounded-none md:p-4`}
                >
                  <h1 className="flex basis-1/6 justify-start py-0.5 text-start text-lg">
                    {event?.node?.name}
                  </h1>
                  <h1 className="flex basis-1/6 justify-center py-0.5 pr-2 text-start text-lg">
                    {event?.node.branch.name.toLowerCase() === "core" ? (
                      <Badge color="success">{event?.node.branch.name}</Badge>
                    ) : (
                      event?.node.branch.name
                    )}
                  </h1>
                  <h1 className="flex basis-1/6 justify-center py-0.5 text-center text-lg">
                    <RoundsDone eventId={event?.node?.id} />
                  </h1>
                  <h1
                    className={`flex basis-1/6 justify-center py-0.5 text-center text-lg ${event?.node?.published
                      ? "border-green-500 text-green-500"
                      : "border-red-500 text-red-500"
                      }`}
                  >
                    {event?.node.published ? "Published" : "Pending"}
                  </h1>
                  <h1 className="flex basis-1/6 justify-center py-0.5 text-center text-lg">
                    <PublishEventModal
                      eventId={event?.node?.id}
                      eventName={event?.node?.name}
                      published={event?.node?.published}
                    />
                  </h1>
                  <h1 className="mt-2 flex basis-1/6 py-0.5 text-lg md:mt-0 md:justify-center md:pl-5 md:text-center">
                    <ViewEvent Event={event} />
                  </h1>
                </div>
              ))}
            </div>
          </div>
          <div className="ml-2 mt-5 flex basis-1/3 flex-col gap-1 md:gap-0.5">
            <div className="mr-2 flex items-center gap-3">
              <h1 className="text-2xl">Branches</h1>
            </div>
            <div className="hidden h-20 items-center justify-between gap-2.5 rounded-t-lg bg-white bg-opacity-20 bg-clip-padding p-1 font-bold backdrop-blur-lg backdrop-filter md:flex">
              <h1 className="basis-1/2 py-2.5 pl-2 text-start text-lg">
                Branch Name
              </h1>
              <h1 className="basis-1/2 py-2.5 pr-5 text-end text-base">
                Add Branch Representative
              </h1>
            </div>
            {branchesLoading && (
              <div className="mt-10 flex items-center justify-center">
                <Spinner className="text-gray-300" />
              </div>
            )}
            <div className="max-h-60 overflow-y-auto md:h-96 md:max-h-screen">
              {branches?.getBranches.__typename === "QueryGetBranchesSuccess" &&
                Array.from(branches.getBranches.data).sort(
                  (a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1)?.map((branch, i) => (
                    <div
                      key={i}
                      className={`mb-3 flex flex-col items-start justify-between gap-3 rounded-lg bg-white/10 p-3 md:my-0 md:ml-0 md:flex-row md:items-center md:gap-5 md:rounded-none md:p-4`}
                    >
                      <h1 className="basis-1/2 py-0.5 pl-2 text-start text-lg">
                        {branch?.name}
                      </h1>
                      <h1 className="flex basis-1/2 justify-end py-0.5 pr-1 text-end text-lg">
                        <AddBranchRep
                          branchId={branch?.id}
                          branchName={branch?.name}
                          branchReps={branch?.branchReps}
                        />
                      </h1>
                    </div>
                  ))}
            </div>
            <AddBranchModal />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminTab;
