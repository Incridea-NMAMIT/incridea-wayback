import { useQuery } from "@apollo/client";
import Link from "next/link";
import { type FC } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdOutlineExplore } from "react-icons/md";

import Spinner from "~/components/spinner";
import { RegisterdEventsDocument } from "~/generated/generated";

import EventCard from "./eventCard";

const UserEvents: FC<{
  userId: string;
}> = ({ userId }) => {
  const { data: events, loading, error } = useQuery(RegisterdEventsDocument);

  return (
    <section className="h-full rounded-xl border border-primary-200/80 bg-primary-500">
      <div className="py-5 text-center text-5xl text-white">My Quests</div>

      <div className="mt-2 flex items-center justify-center">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Spinner size={"medium"} intent={"white"} />
          </div>
        ) : events?.registeredEvents.__typename ===
            "QueryRegisteredEventsSuccess" &&
          events.registeredEvents.data.length === 0 ? (
          <div
            data-scroll
            className={`flex h-full flex-col items-center justify-center gap-5 rounded-xl p-10 text-center text-xl text-white`}
          >
            <MdOutlineExplore size={50} />
            <p className="text-base text-white/80 md:text-xl">
              Register for an event to see it here!
            </p>
            <Link href="/events" className="text-white">
              <button className="mt-1 flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-tr from-secondary-800 to-secondary-600 px-5 py-2 text-sm capitalize text-white transition-all duration-300 hover:scale-[1.02] hover:brightness-125 md:text-lg">
                <FaExternalLinkAlt size={16} />
                Explore Quests
              </button>
            </Link>
          </div>
        ) : null}

        {!loading &&
          !error &&
          events?.registeredEvents.__typename ===
            "QueryRegisteredEventsSuccess" &&
          events.registeredEvents.data.length !== 0 && (
            <div className="h-[80dvh] space-y-2">
              <div className="mx-auto w-full space-y-4 bg-primary-500 px-5">
                <div className="z-1 mb-5 flex w-full justify-center text-center font-bold text-white">
                  <p className="w-fit rounded-full border border-primary-200/80 px-3 py-1">
                    You have entered{" "}
                    <span className="text-secondary-500">
                      {events.registeredEvents.data.length}
                    </span>{" "}
                    quest{events.registeredEvents.data.length > 1 && "s"}!
                  </p>
                </div>

                <div className="flex flex-wrap items-stretch justify-center gap-5 pb-5">
                  {events?.registeredEvents.__typename ===
                    "QueryRegisteredEventsSuccess" &&
                    events?.registeredEvents.data?.map((event, i) => (
                      <EventCard
                        key={i}
                        teams={event.teams}
                        event={event}
                        userId={userId}
                      />
                    ))}
                </div>
              </div>
            </div>
          )}
      </div>
    </section>
  );
};

export default UserEvents;
