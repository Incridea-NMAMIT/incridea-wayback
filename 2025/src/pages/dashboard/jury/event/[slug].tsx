import { useQuery } from "@apollo/client";
import { Tab } from "@headlessui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { CSVLink } from "react-csv";

import ViewTeamModal from "~/components/general/dashboard/jury/viewTeamModal";
import ViewWinners from "~/components/general/dashboard/jury/viewWinners";
import Dashboard from "~/components/layout/dashboard";
import Spinner from "~/components/spinner";
import {
  EventByIdDocument,
  type EventByIdQuery,
  GetScoreSheetJuryDocument,
  type GetScoreSheetJuryQuery,
  Role,
} from "~/generated/generated";
import { useAuth } from "~/hooks/useAuth";
import { StatusBadge } from "~/pages/dashboard/jury";

const Page = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const query = router.query;
  const slug = query.slug instanceof Array ? query.slug[0] : query.slug;

  const id = slug?.split("-").pop();

  const { data: event, loading: eventLoading } = useQuery(EventByIdDocument, {
    variables: {
      id: id!,
    },
    skip: !id,
  });

  if (loading || eventLoading)
    return (
      <div className="flex h-screen w-screen justify-center">
        <Spinner />
      </div>
    );
  if (!user) {
    void router.push("/login");
    return <div>Redirecting...</div>;
  }
  if (user.role !== Role.Jury && user.role !== Role.Admin) {
    void router.push("/profile");
    return <div>Redirecting...</div>;
  }
  if (!event || event.eventById.__typename === "Error") return <div>Event not found</div>;

  return (
    <Dashboard>
      <RoundTabs eventId={event.eventById.data.id} rounds={event.eventById.data.rounds} />
    </Dashboard>
  );
};

const RoundTabs = ({
  rounds,
  eventId,
}: {
  rounds: Extract<EventByIdQuery["eventById"], {
    __typename: "QueryEventByIdSuccess";
  }>["data"]["rounds"];
  eventId: string;
}) => {
  const getRoundStatus = (round: typeof rounds[number]) => {
    if (round.completed) return "COMPLETED";
    const roundTime = rounds.find((r) => r.roundNo === round.roundNo)?.date;
    if (roundTime && new Date(roundTime).getTime() > new Date().getTime())
      return "YET_TO_START";
    return "ONGOING";
  };
  return (
    <Tab.Group
      as={"div"}
      className="mt-5 overflow-hidden border-0 border-gray-900/40 sm:rounded-xl"
    >
      <Tab.List className="flex w-full overflow-x-auto bg-gray-400/20 backdrop-blur-md">
        {rounds.map((round) => (
          <Tab
            key={`${round.roundNo}-${eventId}`}
            className="focus:outline-none"
          >
            {({ selected }) => (
              <button
                className={`whitespace-nowrap p-3 text-base font-semibold transition-colors sm:px-5 sm:py-4 sm:text-lg ${selected
                  ? "bg-gray-900 text-white shadow-lg shadow-black"
                  : "bg-transparent text-white hover:bg-gray-800/60"
                  }`}
              >
                <span>Round {round.roundNo} </span>
                <StatusBadge status={getRoundStatus(round)} />{" "}
              </button>
            )}
          </Tab>
        ))}
        <Tab className="focus:outline-none" key="winners">
          {({ selected }) => (
            <button
              className={`whitespace-nowrap p-3 text-base font-semibold transition-colors sm:px-5 sm:py-4 sm:text-lg ${selected
                ? "bg-gray-900 text-white shadow-lg shadow-black"
                : "bg-transparent text-white hover:bg-gray-800/60"
                }`}
            >
              <span>Winners</span>
            </button>
          )}
        </Tab>
      </Tab.List>
      <Tab.Panels>
        {rounds.map((round) => (
          <Tab.Panel key={`${round.roundNo}-${eventId}`}>
            <RoundTable eventId={eventId} roundNo={round.roundNo} />
          </Tab.Panel>
        ))}
        <Tab.Panel key={`winners`}>
          <ViewWinners eventId={eventId} />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

const RoundTable = ({
  eventId,
  roundNo,
}: {
  eventId: string;
  roundNo: number;
}) => {
  const {
    data: round,
    loading: roundLoading,
    error: roundError,
  } = useQuery(GetScoreSheetJuryDocument, {
    variables: {
      eventId: eventId,
      roundNo: roundNo,
    },
  });

  if (roundLoading) return <Spinner />;
  if (!round) return <div>Something went wrong</div>;
  if (roundError || round.getScoreSheetJuryView.__typename === "Error")
    return <div>Something went wrong</div>;
  if (round.getScoreSheetJuryView.data.length === 0)
    return <div>Nothing to show</div>;
  return (
    <JudgeTable
      judges={round.getScoreSheetJuryView.data[0]!.judges}
      teams={round.getScoreSheetJuryView.data}
    />
  );
};

type QuerySuccess = Extract<GetScoreSheetJuryQuery["getScoreSheetJuryView"],
  { __typename: "QueryGetScoreSheetJuryViewSuccess" }
>;

const JudgeTable = ({
  judges,
  teams,
}: {
  judges: QuerySuccess["data"][number]["judges"];
  teams: QuerySuccess["data"];
}) => {
  const [csvData, setCsvData] = useState<
    {
      JudgeName: string | undefined;
    }[]
  >([]);
  const [judgeName, setJudgeName] = useState<string | null>(null);
  const process = (judgeId: number) => {
    const judgesData: QuerySuccess["data"][number]["judges"][] = [];
    const teamData: string[] = [];
    const data = [];
    teams.map((team) => {
      const judges = team.judges;
      teamData.push(team.teamName);
      const temp = judges.filter((judge) => judge.judgeId === judgeId);
      judgesData.push(temp);
    });
    data.push({ JudgeName: judgesData[0]?.[0]?.judgeName });

    teamData.map((team, index) => {
      const obj: {
        [key: string]: number | string;
        judgeTotal: number;
        teamNames: string;
      } = {
        judgeTotal: 0,
        teamNames: team,
      };
      let sum = 0;
      judgesData[index]?.[0]?.criteria?.map((data) => {
        obj[data.criteriaName] = data.score;
        sum += data.score;
      });
      obj.judgeTotal = sum;
      data.push(obj);
    });
    return data;
  };

  return (
    <Tab.Group>
      <Tab.List className="flex w-full items-center gap-5 bg-gray-300/20 p-2 text-white">
        <span className="ml-3 text-xl font-semibold">Judges </span>
        {judges.map((judge, idx) => (
          <Tab
            key={idx}
            className="flex w-fit items-center gap-2 p-2 outline-none"
          >
            {({ selected }) => (
              <button
                onClick={() => {
                  if (judge.judgeId) setCsvData(process(judge.judgeId));
                  setJudgeName(judge?.judgeName);
                }}
                className={`px-4 py-2 font-semibold shadow-md hover:bg-gray-700/90 ${selected ? "bg-gray-700" : "bg-gray-600"
                  }`}
              >
                {judge.judgeName}
              </button>
            )}
          </Tab>
        ))}
        {judgeName ? (
          <button className="ml-auto mr-5 rounded-sm bg-green-500 p-2">
            <CSVLink data={csvData}>
              Download Score sheet by {judgeName}
            </CSVLink>
          </button>
        ) : (
          <p className="ml-auto mr-5 bg-gray-800 p-3 font-semibold shadow-md">
            Click a judge for download option
          </p>
        )}
      </Tab.List>
      <Tab.Panels>
        {judges.map((judge, idx) => (
          <Tab.Panel key={idx}>
            <div className="hidden h-16 items-center justify-between gap-2.5 bg-white bg-opacity-20 bg-clip-padding p-1 text-xl font-bold backdrop-blur-lg backdrop-filter md:flex">
              <div className="basis-1/3 py-2.5 pl-2 text-center">Team Name</div>
              {judge.criteria.map((criteria, idx) => (
                <div
                  key={idx}
                  className="basis-1/3 py-2.5 pl-2 text-center"
                >
                  {criteria.criteriaName}
                </div>
              ))}
              <div className="basis-1/3 py-2.5 pl-2 text-center">
                Judge Total
              </div>
              <div className="basis-1/3 py-2.5 pr-2 text-center">
                Grand Total
              </div>
            </div>
            {teams.map((team, idx) => (
              <div
                key={idx}
                className="mb-3 flex w-full flex-col items-start rounded-lg bg-white/10 p-3 md:my-0 md:flex-row md:items-center md:justify-evenly md:rounded-none md:p-4 md:text-center"
              >
                <div className="basis-1/3 py-0.5 text-center text-lg">
                  {team.teamName}
                </div>
                <ViewTeamModal
                  teamId={team.teamId.toString()}
                  teamName={team.teamName}
                />

                {team.judges
                  .find((j) => j.judgeId === judge.judgeId)
                  ?.criteria.map((criteria, idx) => (
                    <div
                      key={idx}
                      className="basis-1/3 py-0.5 text-center text-lg"
                    >
                      {criteria.score}
                    </div>
                  ))}
                <div className="basis-1/3 py-0.5 text-center text-lg">
                  {team.judges
                    .find((j) => j.judgeId === judge.judgeId)
                    ?.criteria.reduce((acc, curr) => acc + curr.score, 0)}
                </div>
                <div className="basis-1/3 py-0.5 text-center text-lg">
                  {team.teamScore}
                </div>
              </div>
            ))}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

export default Page;
