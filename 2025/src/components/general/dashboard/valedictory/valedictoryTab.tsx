import { useQuery } from "@apollo/client";
import { type FC, useEffect, useState } from "react";
import { CSVLink } from "react-csv";

import SearchBox from "~/components/searchbox";
import Spinner from "~/components/spinner";
import { CompletedEventsDocument, WinnerType } from "~/generated/generated";
import { idToPid, idToTeamId } from "~/utils/id";

import ViewTeamModal from "./viewTeamModal";

const ValedictoryTab: FC = () => {
  const [query, setQuery] = useState("");

  const [csvData, setCsvData] = useState<
    {
      name: string;
      phoneno: string | null | undefined;
      college: string | null | undefined;
      email: string;
      pid: string;
      teamId: string | undefined;
      teamName: string | undefined;
      eventName: string;
    }[]
  >([]);

  const [csvData1, setCsvData1] = useState<
    {
      eventName: string;
      winner?: string;
      runnerUp?: string;
      secondRunnerUp?: string;
    }[]
  >([]);

  const headers1 = [
    { label: "Event Name", key: "eventName" },
    { label: "Winner", key: "winner" },
    { label: "Runner Up", key: "runnerUp" },
    { label: "Second Runner Up", key: "secondRunnerUp" },
  ];

  const headers2 = [
    { label: "Team Id", key: "teamId" },
    { label: "Team Name", key: "teamName" },
    { label: "Event Name", key: "eventName" },
    { label: "Member PID", key: "pid" },
    { label: "Name", key: "name" },
    { label: "Phone No", key: "phoneno" },
    { label: "College", key: "college" },
    { label: "Email", key: "email" },
  ];

  const { data: eventsData, loading: eventsLoading } = useQuery(
    CompletedEventsDocument,
  );

  useEffect(() => {
    const processData = () => {
      if (
        eventsData?.completedEvents.__typename !== "QueryCompletedEventsSuccess"
      )
        return;

      eventsData?.completedEvents.data.map((event) => {
        const temp: {
          eventName: string;
          winner?: string;
          runnerUp?: string;
          secondRunnerUp?: string;
        } = {
          eventName: event.name,
        };
        event.winner?.map((eventData) => {
          if (eventData.type === WinnerType.Winner) {
            temp.winner = eventData.team.name;
          }
          if (eventData.type === WinnerType.RunnerUp) {
            temp.runnerUp = eventData.team.name;
          }
          if (eventData.type === WinnerType.SecondRunnerUp) {
            temp.secondRunnerUp = eventData.team.name;
          }
        });
        setCsvData1((prev) => [...prev, temp]);
      });

      eventsData?.completedEvents.data.map((event) => {
        const temp: {
          eventName: string;
          winner?: string;
          runnerUp?: string;
          secondRunnerUp?: string;
          teamId?: string;
          teamName?: string;
        } = {
          eventName: event.name,
        };
        event?.winner?.map((eventData) => {
          temp.teamId = idToTeamId(eventData.team.id);
          temp.teamName = eventData.team.name;
          eventData.team.members.map((data) => {
            const tempp: {
              name: string;
              phoneno: string | null | undefined;
              college: string | null | undefined;
              email: string;
              pid: string;
              teamId: string | undefined;
              teamName: string | undefined;
              eventName: string;
            } = {
              name: data.user.name,
              phoneno: data.user.phoneNumber,
              college: data.user.college?.name,
              email: data.user.email,
              pid: idToPid(data.user.id),
              teamId: temp.teamId,
              teamName: temp.teamName,
              eventName: temp.eventName,
            };
            setCsvData((prev) => [...prev, tempp]);
          });
        });
      });
    };
    processData();
  }, [eventsData]);

  return (
    <>
      <div className="mt-5 flex basis-2/3 flex-col justify-center gap-1 md:gap-0.5">
        <div className="ml-2 flex items-center gap-3">
          <h1 className="text-2xl">Events</h1>
          <div className="ml-auto flex justify-evenly gap-2">
            <button className="rounded-lg bg-green-500 p-2">
              <CSVLink
                data={csvData1}
                headers={headers1}
                filename={"event-results.csv"}
              >
                Download Event Results
              </CSVLink>
            </button>
            <button className="rounded-lg bg-green-500 p-2">
              <CSVLink
                data={csvData}
                headers={headers2}
                filename={"team-details.csv"}
              >
                Download Team Details
              </CSVLink>
            </button>
          </div>
        </div>
        <SearchBox
          placeholder="Search by event name"
          className="my-2 ml-2"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
        <div className="ml-2 hidden h-20 items-center justify-between gap-2.5 rounded-t-lg bg-white bg-opacity-20 bg-clip-padding p-1 text-lg font-bold backdrop-blur-lg backdrop-filter md:flex">
          <h1 className="basis-1/4 py-2.5 pl-2 text-start">Event Name</h1>
          <h1 className="basis-1/4 py-2.5 pr-5 text-center">Winner</h1>
          <h1 className="basis-1/4 py-2.5 pr-5 text-center">Runner Up</h1>
          <h1 className="basis-1/4 py-2.5 pr-5 text-center">
            Second Runner Up
          </h1>
        </div>
        {eventsLoading && (
          <div className="mt-10 flex items-center justify-center">
            <Spinner className="text-gray-300" />
          </div>
        )}
        <div className="max-h-80 w-full overflow-y-auto text-center md:h-[300px] md:max-h-80">
          {eventsData?.completedEvents.__typename ===
            "QueryCompletedEventsSuccess"
            ? eventsData.completedEvents.data.map(
              (event, i) =>
                event.name.toLowerCase().includes(query.toLowerCase()) && (
                  <div
                    key={i}
                    className={`mb-3 ml-2 flex flex-col items-start rounded-lg bg-white/10 p-3 md:my-0 md:flex-row md:items-center md:rounded-none md:p-4`}
                  >
                    <h1 className="flex basis-1/4 justify-start py-0.5 text-start text-lg">
                      {event?.name}
                    </h1>
                    <h1 className="mt-2 flex basis-1/4 py-0.5 text-lg md:mt-0 md:justify-center md:pl-5 md:text-center">
                      {event.winner?.map((eventData, i) =>
                        eventData.type === WinnerType.Winner ? (
                          <ViewTeamModal
                            key={i}
                            teamId={eventData.team.id}
                            modalTitle={event.name}
                            modalResult={eventData.type}
                            teamName={eventData.team.name}
                            eventType={event.eventType}
                          />
                        ) : (
                          ""
                        ),
                      )}
                    </h1>
                    <h1 className="mt-2 flex basis-1/4 py-0.5 text-lg md:mt-0 md:justify-center md:pl-5 md:text-center">
                      {event.winner?.map((eventData, i) =>
                        eventData.type === WinnerType.RunnerUp ? (
                          <ViewTeamModal
                            key={i}
                            teamId={eventData.team.id}
                            modalTitle={event.name}
                            modalResult={eventData.type}
                            teamName={eventData.team.name}
                            eventType={event.eventType}
                          />
                        ) : (
                          ""
                        ),
                      )}
                    </h1>
                    <h1 className="mt-2 flex basis-1/4 py-0.5 text-lg md:mt-0 md:justify-center md:pl-5 md:text-center">
                      {event.winner?.map((eventData, i) =>
                        eventData.type === WinnerType.SecondRunnerUp ? (
                          <ViewTeamModal
                            key={i}
                            teamId={eventData.team.id}
                            modalTitle={event.name}
                            modalResult={eventData.type}
                            teamName={eventData.team.name}
                            eventType={event.eventType}
                          />
                        ) : (
                          ""
                        ),
                      )}
                    </h1>
                  </div>
                ),
            )
            : ""}
        </div>
      </div>
    </>
  );
};

export default ValedictoryTab;
