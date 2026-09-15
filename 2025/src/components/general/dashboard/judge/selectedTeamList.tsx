import { useMutation } from "@apollo/client";
import { toast } from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";

import Button from "~/components/button";
import Spinner from "~/components/spinner";
import createToast from "~/components/toast";
import {
  DeleteWinnerDocument,
  type JudgeGetTeamsByRoundQuery,
  PromoteToNextRoundDocument,
  type WinnersByEventQuery,
} from "~/generated/generated";
import { idToPid, idToTeamId } from "~/utils/id";

import ConfirmRoundModal from "./confirmRoundModal";

const SelectedTeamList = ({
  shouldPoll,
  teams,
  roundNo,
  finalRound,
  winners,
  winnersLoading,
  eventId,
  eventType,
}: {
  shouldPoll: boolean,
  teams: JudgeGetTeamsByRoundQuery;
  roundNo: number;
  finalRound: boolean;
  winners: WinnersByEventQuery | undefined;
  winnersLoading: boolean;
  eventId: string;
  eventType: string;
}) => {
  const [promote, { loading: promoteLoading }] = useMutation(
    PromoteToNextRoundDocument,
    {
      refetchQueries: [...(shouldPoll ? [] : ["JudgeGetTeamsByRound"])],
    }
  );

  const [deleteWinner, { loading: deleteLoading }] = useMutation(
    DeleteWinnerDocument,
    {
      refetchQueries: ["WinnersByEvent", "RoundByJUdge"],
      awaitRefetchQueries: true,
    },
  );

  const handlePromote = async (teamId: string) => {
    const promise = promote({
      variables: {
        teamId,
        roundNo: roundNo.toString(),
        selected: false,
      },
      refetchQueries: ["GetTotalScores"],
      awaitRefetchQueries: true,
    });
    await createToast(promise, "Removing team...");
  };

  const teamOrParticipant =
    eventType === "INDIVIDUAL" || eventType === "INDIVIDUAL_MULTIPLE_ENTRY"
      ? "Participant"
      : "Team";

  return (
    <div className="h-full overflow-y-auto">
      <div className="sticky top-0 mb-2 rounded-t-lg bg-[#35436F] px-4 py-3 shadow-sm">
        <h1 className="text-2xl font-semibold">Selected Teams</h1>
      </div>

      {!(
        teams.judgeGetTeamsByRound.__typename ===
        "QueryJudgeGetTeamsByRoundSuccess" &&
        teams.judgeGetTeamsByRound.data.filter((team) => team.roundNo > roundNo)
          .length === 0
      ) &&
        !finalRound && (
          <p>
            <span className="ml-5 text-white/60">
              These teams are selected to Round {roundNo + 1}
            </span>
          </p>
        )}
      {finalRound && (
        <p>
          <span className="ml-5 text-white/60">
            These teams are selected as Winners, Runners and Second Runners.
          </span>
        </p>
      )}

      <div className="mt-3 flex flex-col gap-2 px-3 pb-3">
        <div className={`flex items-center rounded-lg bg-white/10 p-2 px-5`}>
          <div className="flex w-full flex-row gap-5">
            <div
              className={`${finalRound ? "basis-1/4" : "basis-1/3"
                } text-white/80`}
            >
              Team Name
            </div>
            <div
              className={`${finalRound ? "basis-1/4" : "basis-1/3"
                } text-white/80`}
            >
              {teamOrParticipant === "Participant" ? "PID" : "Team ID"}
            </div>
            {finalRound && (
              <div
                className={`${finalRound ? "basis-1/4" : "basis-1/3"
                  } text-white/80`}
              >
                Position
              </div>
            )}
            <div
              className={`${finalRound ? "basis-1/4" : "basis-1/3"
                } text-white/80`}
            >
              Remove
            </div>
          </div>
        </div>

        {!finalRound &&
          teams.judgeGetTeamsByRound.__typename ===
          "QueryJudgeGetTeamsByRoundSuccess" &&
          teams.judgeGetTeamsByRound.data.filter(
            (team) => team.roundNo > roundNo,
          ).length === 0 && (
            <p className="my-3 mt-5 text-center italic text-gray-400/70">
              No participants are selected to next round.
            </p>
          )}

        {!finalRound &&
          teams.judgeGetTeamsByRound.__typename ===
          "QueryJudgeGetTeamsByRoundSuccess" &&
          teams.judgeGetTeamsByRound.data
            .filter((team) => team.roundNo > roundNo)
            .map((team, index) => (
              <div
                key={index}
                className="flex items-center rounded-lg bg-white/10 p-2 px-5 transition-colors duration-300 hover:bg-white/20"
              >
                <div className="flex w-full flex-row gap-5">
                  <div className="basis-1/3 text-white/80">{team?.name}</div>
                  <div className="basis-1/3 text-white/60">
                    {teamOrParticipant === "Participant"
                      ? idToPid(team?.leaderId?.toString() ?? "")
                      : idToTeamId(team?.id)}
                  </div>
                  <div className="basis-1/3">
                    <Button
                      onClick={async () => await handlePromote(team?.id)}
                      disabled={promoteLoading}
                    >
                      <AiOutlineClose />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

        {finalRound && winnersLoading && <Spinner />}
        {finalRound &&
          !winnersLoading &&
          winners?.winnersByEvent.__typename === "QueryWinnersByEventSuccess" &&
          winners.winnersByEvent.data.length === 0 && (
            <p className="my-3 mt-5 text-center italic text-gray-400/70">
              No winners are selected.
            </p>
          )}
        {finalRound &&
          winners?.winnersByEvent.__typename === "QueryWinnersByEventSuccess" &&
          winners?.winnersByEvent.data.map((winner, index) => (
            <div
              key={index}
              className="flex items-center rounded-lg bg-white/10 p-2 px-5 transition-colors duration-300 hover:bg-white/20"
            >
              <div className="flex w-full flex-row gap-5">
                <div className="basis-1/4 text-white/80">
                  {winner?.team.name}
                </div>
                <div className="basis-1/4 text-white/60">
                  {teamOrParticipant === "Participant"
                    ? idToPid(winner.team.leaderId?.toString() ?? "")
                    : idToTeamId(winner.team.id)}
                </div>
                <div className="basis-1/4 text-white/60">
                  {winner.type
                    .replace(/_/g, " ")
                    .replace(
                      /\b\w+/g,
                      (match) =>
                        match.charAt(0).toUpperCase() +
                        match.slice(1).toLowerCase(),
                    )}
                </div>
                <div className="basis-1/4">
                  <Button
                    onClick={async () => {
                      const promise = deleteWinner({
                        variables: {
                          id: winner?.id,
                        },
                        refetchQueries: ["GetTotalScores", "WinnersByEvent"],
                        awaitRefetchQueries: true,
                      }).then((data) => {
                        if (data.data?.deleteWinner.__typename === "Error") {
                          toast.error(data.data?.deleteWinner.message, {
                            position: "bottom-center",
                          });
                        }
                      });
                      await createToast(promise, "Removing winner...");
                    }}
                    disabled={deleteLoading}
                  >
                    <AiOutlineClose />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        <ConfirmRoundModal
          shouldPoll={shouldPoll}
          winners={winners}
          roundNo={roundNo}
          winnersLoading={winnersLoading}
          eventId={eventId}
          finalRound={finalRound}
          selectedTeams={teams}
          solo={teamOrParticipant === "Participant"}
        />
      </div>
    </div>
  );
};

export default SelectedTeamList;
