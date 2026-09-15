import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineSearch } from "react-icons/ai";

import Button from "~/components/button";
import Spinner from "~/components/spinner";
import createToast from "~/components/toast";
import {
  ChangeSelectStatusDocument,
  CreateWinnerDocument,
  GetRoundStatusDocument,
  GetTotalScoresDocument,
  type JudgeGetTeamsByRoundQuery,
  PromoteToNextRoundDocument,
  WinnerType,
  type WinnersByEventQuery,
} from "~/generated/generated";
import { idToPid, idToTeamId } from "~/utils/id";

import ViewTeamModal from "./viewTeamModal";

const TeamList = ({
  shouldPoll,
  data,
  loading,
  roundNo,
  eventId,
  eventType,
  selectedTeam,
  setSelectedTeam,
  selectionMode,
  setSelectionMode,
  finalRound,
  winners,
}: {
  shouldPoll: boolean,
  data: JudgeGetTeamsByRoundQuery | undefined;
  loading: boolean;
  roundNo: number;
  eventId: string;
  eventType: string;
  selectedTeam: string | null;
  setSelectedTeam: React.Dispatch<React.SetStateAction<string | null>>;
  selectionMode: boolean;
  setSelectionMode: React.Dispatch<React.SetStateAction<boolean>>;
  finalRound: boolean;
  winners: WinnersByEventQuery | undefined;
}) => {
  const [query, setQuery] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = React.useState<
    "Total Score" | "Your Score"
  >("Total Score");

  const [winnerType, setWinnerType] = React.useState<WinnerType>(
    WinnerType.Winner,
  );

  const [promote, { loading: promoteLoading }] = useMutation(
    PromoteToNextRoundDocument,
    {
      refetchQueries: [...(shouldPoll ? [] : ["JudgeGetTeamsByRound"])],
    }
  );

  const [changeStatus, { loading: changeLoading }] = useMutation(
    ChangeSelectStatusDocument,
    {
      refetchQueries: ["GetTotalScores", ...(shouldPoll ? [] : ["GetRoundStatus"])],
      awaitRefetchQueries: true,
    },
  );

  const [selectWinner, { loading: winnerLoading }] = useMutation(
    CreateWinnerDocument,
    {
      refetchQueries: ["WinnersByEvent"],
      awaitRefetchQueries: true,
    },
  );

  const { data: roundStatus } = useQuery(GetRoundStatusDocument, {
    ...(shouldPoll ? { pollInterval: 1000 } : {}),
    variables: {
      roundNo: roundNo,
      eventId: eventId,
    },
  });

  const { data: scores, loading: scoresLoading } = useQuery(
    GetTotalScoresDocument,
    {
      variables: {
        eventId: eventId,
        roundNo: roundNo,
      },
      skip: !eventId || !roundNo,
    },
  );

  useEffect(() => {
    if (
      roundStatus?.getRoundStatus.__typename ===
      "QueryGetRoundStatusSuccess"
    ) {
      if (roundStatus.getRoundStatus.data.selectStatus) setSelectionMode(true);
    }

    return () => setSelectionMode(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundStatus]);

  const teamOrParticipant =
    eventType === "INDIVIDUAL" || eventType === "INDIVIDUAL_MULTIPLE_ENTRY"
      ? "Participant"
      : "Team";

  const handlePromote = async (teamId: string) => {
    const promise = promote({
      variables: {
        teamId,
        roundNo: roundNo.toString(),
        selected: true,
      },
    });
    await createToast(promise, "Promoting team to next round...");
  };

  const sorter = sortField === "Total Score" ? "totalScore" : "judgeScore";

  const getTotalScore = (
    team: Extract<
      JudgeGetTeamsByRoundQuery["judgeGetTeamsByRound"],
      {
        __typename: "QueryJudgeGetTeamsByRoundSuccess";
      }
    >["data"][0],
  ) => {
    const score =
      scores?.getTotalScores.__typename === "QueryGetTotalScoresSuccess"
        ? scores?.getTotalScores.data.find(
          (score) => score.teamId === Number(team.id),
        )?.[sorter]
        : null;
    return score;
  };

  const filteredTeams = [
    ...(data?.judgeGetTeamsByRound.__typename ===
      "QueryJudgeGetTeamsByRoundSuccess"
      ? data.judgeGetTeamsByRound.data
      : []),
  ].filter((team) => {
    if (
      finalRound &&
      winners?.winnersByEvent.__typename === "QueryWinnersByEventSuccess"
    ) {
      const isWinner =
        winners?.winnersByEvent.__typename === "QueryWinnersByEventSuccess" &&
        winners?.winnersByEvent.data.find(
          (winner) => winner.team.id === team.id,
        );
      return !isWinner;
    } else {
      return true;
    }
  });

  const sortedTeams = [...(filteredTeams ?? [])].sort((team1, team2) => {
    const score1 = getTotalScore(team1) ?? 0;
    const score2 = getTotalScore(team2) ?? 0;
    if (sortOrder === "asc") {
      return score1 - score2;
    } else if (sortOrder === "desc") {
      return score2 - score1;
    } else {
      return 0;
    }
  });

  return (
    <div className="h-full overflow-y-auto">
      <div className="sticky top-0 mb-1 flex justify-between rounded-t-lg bg-[#35436F] p-3 shadow-sm">
        <div className="relative mr-5 w-full">
          <input
            type={"text"}
            placeholder="Search by name or PID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`h-10 w-full rounded-lg bg-white/20 px-4 pr-16 text-sm ring-white/40 placeholder:text-white/60 focus:outline-none focus:ring-2`}
          />
          <AiOutlineSearch
            size={"1.4rem"}
            className="absolute right-3 top-2.5 text-white/60"
          />
        </div>
        {selectionMode && (
          <>
            <Button
              size={"small"}
              intent={"dark"}
              className="mr-2"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? "▲" : "▼"}
            </Button>

            <select
              value={sortField}
              onChange={(e) =>
                setSortField(e.target.value as "Total Score" | "Your Score")
              }
              className="mr-2 rounded-lg bg-white/20 px-3 py-2 text-white/60 ring-white/40 focus:outline-none focus:ring-2"
            >
              <option value="Total Score">Total Score</option>
              <option value="Your Score">Your Score</option>
            </select>
          </>
        )}

        <Button
          onClick={async () => {
            await changeStatus({
              variables: {
                eventId,
                roundNo,
              },
            }).then((data) => {
              if (data.data?.changeSelectStatus.__typename === "Error") {
                toast.error(data.data.changeSelectStatus.message, {
                  position: "bottom-center",
                });
              }
            });
            setSelectionMode(!selectionMode);
          }}
          disabled={changeLoading}
          intent={"success"}
          className="w-40"
          noScaleOnHover
        >
          {selectionMode ? "Go Back" : "Select"}
        </Button>
      </div>

      <div className="mt-3 flex flex-col gap-2 px-3 pb-3">
        {selectionMode && finalRound && (
          <div className="my-3 flex flex-row justify-between">
            {Object.values(WinnerType).map((type) => (
              <Button
                key={type}
                onClick={() => setWinnerType(type)}
                intent={type === winnerType ? "primary" : "ghost"}
                className="mr-2"
                noScaleOnHover
              >
                {type.replaceAll("_", " ")}
              </Button>
            ))}
          </div>
        )}
        <div className={`flex items-center rounded-lg bg-white/10 p-2 px-5`}>
          <div className="flex w-full flex-row gap-5">
            <div className={`basis-4/12 text-white/80`}>Name</div>
            <div className={`basis-4/12 text-white/80`}>ID</div>
            <div
              className={`${selectionMode ? "basis-1/12" : "basis-4/12"
                } text-white/80`}
            >
              Score
            </div>
            {selectionMode && (
              <div className={`basis-1/12 text-white/80`}>Total</div>
            )}
            {selectionMode ? (
              <div className={`basis-2/12 text-white/80`}>
                {finalRound ? "Select" : "Promote"}
              </div>
            ) : (
              <div className={`flex basis-2/12 items-end justify-end`}>
                {teamOrParticipant === "Team" && "View"}
              </div>
            )}
          </div>
        </div>
        {loading && <Spinner />}
        {(!loading && !data) ||
          (sortedTeams.length === 0 && (
            <p className="my-3 mt-5 text-center italic text-gray-400/70">
              No {teamOrParticipant}s found.
            </p>
          ))}
        {sortedTeams
          .filter(
            (team) =>
              team.roundNo === roundNo &&
              (idToTeamId(team.id)
                .toLowerCase()
                .includes(query.toLowerCase()) ||
                team.name.toLowerCase().includes(query.toLowerCase())),
          )
          .map((team) => (
            <div
              key={team?.id}
              onClick={() => {
                setSelectedTeam(team?.id);
              }}
              className={`flex cursor-pointer items-center rounded-lg bg-white/10 p-2 px-5 ${selectedTeam === team?.id
                ? "bg-white/50"
                : "transition-colors duration-300 hover:bg-white/20"
                }`}
            >
              <div className="flex w-full flex-row gap-5">
                <div
                  className={`basis-4/12 ${selectedTeam === team?.id
                    ? "text-black/80"
                    : "text-white/80"
                    }`}
                >
                  {team?.name}
                </div>

                <div
                  className={`basis-4/12 ${selectedTeam === team?.id
                    ? "text-black/60"
                    : "text-white/60"
                    }`}
                >
                  {teamOrParticipant === "Team"
                    ? idToTeamId(team.id)
                    : idToPid(team.leaderId?.toString() ?? "")}
                </div>

                <div
                  className={`${selectionMode ? "basis-1/12" : "basis-4/12"} ${selectedTeam === team?.id
                    ? "text-black/60"
                    : "text-white/60"
                    }`}
                >
                  {scoresLoading && <Spinner />}
                  {scores?.getTotalScores.__typename ===
                    "QueryGetTotalScoresSuccess" &&
                    scores?.getTotalScores.data.find(
                      (score) => score.teamId === Number(team?.id),
                    )?.judgeScore}
                </div>

                {selectionMode && (
                  <div
                    className={`basis-1/12 ${selectedTeam === team?.id
                      ? "text-black/60"
                      : "text-white/60"
                      }`}
                  >
                    {scoresLoading && <Spinner />}
                    {scores?.getTotalScores.__typename ===
                      "QueryGetTotalScoresSuccess" &&
                      scores?.getTotalScores.data.find(
                        (score) => score.teamId === Number(team?.id),
                      )?.totalScore}
                  </div>
                )}

                <div
                  className={`basis-2/12 ${!selectionMode ? "flex items-end justify-end" : ""
                    }`}
                >
                  {selectionMode && !finalRound && (
                    <input
                      disabled={promoteLoading}
                      type="checkbox"
                      className="h-5 w-5 text-white/80"
                      onChange={async () => await handlePromote(team?.id)}
                    />
                  )}
                  {!selectionMode && teamOrParticipant === "Team" && (
                    <ViewTeamModal
                      teamName={team.name}
                      members={team.members}
                    />
                  )}
                  {selectionMode && finalRound && (
                    <Button
                      disabled={winnerLoading}
                      size={"small"}
                      onClick={async () => {
                        const promise = selectWinner({
                          variables: {
                            eventId,
                            teamId: team?.id,
                            type: winnerType,
                          },
                        }).then((data) => {
                          if (data.data?.createWinner.__typename === "Error") {
                            toast.error("Error occured!!", {
                              position: "bottom-center",
                            });
                          }
                        });
                        await createToast(
                          promise,
                          `Selecting ${winnerType}...`,
                        );
                      }}
                    >
                      +
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TeamList;
