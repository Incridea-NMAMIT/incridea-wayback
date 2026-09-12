import { useMutation, useQuery } from "@apollo/client";
import { ConversionHtmlNode } from "@react-three/uikit";
import { useState } from "react";

import Badge from "~/components/badge";
import Button from "~/components/button";
import Modal from "~/components/modal";
import Spinner from "~/components/spinner";
import createToast from "~/components/toast";
import { CONSTANT } from "~/constants";
import {
  CompleteRoadiesRoundDocument,
  CompleteRoundDocument,
  GetTotalScoresDocument,
  type JudgeGetTeamsByRoundQuery,
  type WinnersByEventQuery,
  WinnerType,
} from "~/generated/generated";
import { idToPid, idToTeamId } from "~/utils/id";

const ConfirmRoundModal = ({
  shouldPoll,
  roundNo,
  winners,
  winnersLoading,
  eventId,
  finalRound,
  selectedTeams,
  solo,
}: {
  shouldPoll: boolean;
  roundNo: number;
  winners: WinnersByEventQuery | undefined;
  winnersLoading: boolean;
  eventId: string;
  finalRound: boolean;
  selectedTeams: JudgeGetTeamsByRoundQuery;
  solo: boolean;
}) => {
  const [showModal, setShowModal] = useState(false);

  function handleCloseModal() {
    setShowModal(false);
  }

  const [completeRoadiesRound, {loading: completeRoadiesLoading}] = useMutation(
    CompleteRoadiesRoundDocument,
    {
      refetchQueries: ["RoundByJudge"],
      awaitRefetchQueries: true,
    }
  );

  const [completeRound, { loading: completeLoading }] = useMutation(
    CompleteRoundDocument,
    {
      refetchQueries: ["RoundByJudge", ...(shouldPoll ? [] : ["GetRoundStatus"])],
      awaitRefetchQueries: true,
    },
  );

  const handleCompleteRoadiesRound = async () =>{
    const promise = completeRoadiesRound({
      variables: {
        eventId,
        roundNo: roundNo.toString()
      }
    }).then((data)=> {
      if(
        data.data?.completeRoadiesRound.__typename === "MutationCompleteRoadiesRoundSuccess"
      ){
        setShowModal(false);
      }
    })
    await createToast(promise, "Promoting Teams...");
  }

  const handleComplete = async () => {
    const promise = completeRound({
      variables: {
        roundNo,
        eventId,
      },
    }).then((data) => {
      if (
        data.data?.completeRound.__typename === "MutationCompleteRoundSuccess"
      ) {
        setShowModal(false);
      }
    });
    await createToast(promise, "Confirming winners...");
  };

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

  const disabled =
    winners?.winnersByEvent.__typename === "QueryWinnersByEventSuccess" &&
    winners?.winnersByEvent.data.some(
      (winner) => winner.type === WinnerType.Winner,
    ) &&
    winners?.winnersByEvent.data.some(
      (winner) => winner.type === WinnerType.RunnerUp,
    ) &&
    winners?.winnersByEvent.data.some(
      (winner) => winner.type === WinnerType.SecondRunnerUp,
    );

  return (
    <>
      <Button
        onClick={() => {
          setShowModal(true);
        }}
        disabled={finalRound ? !disabled : false}
        intent={"success"}
        className="w-fit"
        noScaleOnHover
      >
        Confirm {finalRound ? "Winners" : solo ? "Participants" : "Teams"}
      </Button>
      <Modal
        title={`Confirm ${finalRound ? "Winners" : solo ? "Participants" : "Teams"
          }`}
        showModal={showModal}
        onClose={handleCloseModal}
        size="medium"
      >
        <div className="p-5">
          <p>
            Are you sure you want to confirm the{" "}
            {finalRound ? "Winners" : solo ? "Participants" : "Teams"}?
            <br />
            Note that this action cannot be undone.
          </p>

          {!finalRound && (
            <div className="mb-2 mt-2 hidden w-full flex-row justify-evenly rounded-lg bg-gray-600 p-2 md:flex">
              <span
                className={`text-lg font-bold ${solo ? "basis-1/3" : "basis-1/4"
                  } text-center`}
              >
                Sl. No.
              </span>
              <span
                className={`text-lg font-bold ${solo ? "basis-1/3" : "basis-1/4"
                  } text-center`}
              >
                {solo ? "PID" : "Team ID"}
              </span>
              {!solo && (
                <span
                  className={`text-lg font-bold ${solo ? "basis-1/3" : "basis-1/4"
                    } text-center`}
                >
                  Team Name
                </span>
              )}
              <span
                className={`text-lg font-bold ${solo ? "basis-1/3" : "basis-1/4"
                  } text-center`}
              >
                Total Score
              </span>
            </div>
          )}

          {/* Non final round - Confirming participant selection for next round */}
          {!finalRound &&
            selectedTeams.judgeGetTeamsByRound.__typename ===
            "QueryJudgeGetTeamsByRoundSuccess" &&
            selectedTeams.judgeGetTeamsByRound.data.filter(
              (team) => team.roundNo > roundNo,
            ).length === 0 && (
              <p className="text-lg text-white/60">
                No {solo ? "Participants" : "Teams"} to confirm.
              </p>
            )}

          {!finalRound &&
            selectedTeams.judgeGetTeamsByRound.__typename ===
            "QueryJudgeGetTeamsByRoundSuccess" && (
              <div className="my-4 flex w-full flex-wrap gap-2">
                {selectedTeams.judgeGetTeamsByRound.data
                  .filter((team) => team.roundNo > roundNo)
                  .map((team, index) => {
                    return (
                      <div
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-600 p-3 text-center"
                        key={team.id}
                      >
                        <div
                          className={`${solo ? "basis-1/3" : "basis-1/4"
                            } text-lg text-white/60`}
                        >
                          <Badge className="text-xs">{index + 1}</Badge>
                        </div>

                        {!solo && (
                          <h1
                            className={`${solo ? "basis-1/3" : "basis-1/4"
                              } text-lg text-white/60`}
                          >
                            {team.name}
                          </h1>
                        )}

                        <p
                          className={`${solo ? "basis-1/3" : "basis-1/4"
                            } text-lg text-white/60`}
                        >
                          {solo
                            ? idToPid(team.leaderId?.toString() ?? "")
                            : idToTeamId(team.id)}
                        </p>

                        <p
                          className={`${solo ? "basis-1/3" : "basis-1/4"
                            } text-lg text-white/60`}
                        >
                          {scoresLoading && <Spinner intent={"white"} />}
                          {scores?.getTotalScores.__typename ===
                            "QueryGetTotalScoresSuccess" &&
                            scores?.getTotalScores.data.find(
                              (score) => score.teamId === Number(team.id),
                            )?.totalScore}
                        </p>
                      </div>
                    );
                  })}
              </div>
            )}

            {!finalRound &&
              selectedTeams.judgeGetTeamsByRound.__typename ===
                "QueryJudgeGetTeamsByRoundSuccess" &&
              selectedTeams.judgeGetTeamsByRound.data.filter(
                (team) => team.roundNo > roundNo,
              ).length !== 0 && (
                <>
                  {eventId === CONSTANT.ROADIES_EVENT_ID.toString() && roundNo === 1 ? (
                    <Button
                      onClick={handleCompleteRoadiesRound}
                      intent={"success"}
                      noScaleOnHover
                    >
                      {completeLoading ? (
                        <Spinner intent={"white"} />
                      ) : (
                        "Promote to Roadies R2"
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleComplete}
                      disabled={completeLoading}
                      intent={"success"}
                      noScaleOnHover
                    >
                      {completeLoading ? (
                        <Spinner intent={"white"} />
                      ) : (
                        `Confirm ${solo ? "Participants" : "Teams"}`
                      )}
                    </Button>
                  )}
                </>
              )}


          {/* Final round - Confirming winners */}
          {finalRound && winnersLoading && <Spinner />}
          {finalRound && (
            <div className="mb-2 mt-2 hidden w-full flex-row justify-evenly rounded-lg bg-gray-600 p-2 md:flex">
              <span className={`text-center text-lg font-bold`}>Sl. No.</span>
              <span className={`text-center text-lg font-bold`}>
                {solo ? "PID" : "Team ID"}
              </span>
              <span className={`text-center text-lg font-bold`}>Position</span>
              <span className={`text-center text-lg font-bold`}>
                Total Score
              </span>
            </div>
          )}
          {finalRound && (
            <div className="my-2 flex w-full flex-wrap gap-5">
              {winners?.winnersByEvent.__typename ===
                "QueryWinnersByEventSuccess" &&
                winners.winnersByEvent.data.map((winner, index) => {
                  return (
                    <div
                      className="my-2 flex w-full items-center justify-center gap-2 rounded-lg bg-gray-600 p-3 text-center"
                      key={winner.id}
                    >
                      <div className="basis-1/4 text-lg text-white/60">
                        <Badge className="text-xs">{index + 1}</Badge>
                      </div>
                      <p className="basis-1/4 text-lg text-white/60">
                        {solo
                          ? idToPid(winner.team.leaderId?.toString() ?? "")
                          : idToTeamId(winner.team.id)}
                      </p>
                      <div className="basis-1/4">
                        <Badge className="text-xs">
                          {winner.type.replaceAll("_", " ")}
                        </Badge>
                      </div>
                      <p className="basis-1/4 text-lg text-white/60">
                        {scoresLoading && <Spinner intent={"white"} />}
                        {scores?.getTotalScores.__typename ===
                          "QueryGetTotalScoresSuccess" &&
                          scores.getTotalScores.data.find(
                            (score) => score.teamId === Number(winner.team.id),
                          )?.totalScore}
                      </p>
                    </div>
                  );
                })}
            </div>
          )}

          {finalRound &&
            winners?.winnersByEvent.__typename ===
            "QueryWinnersByEventSuccess" && (
              <Button
                onClick={handleComplete}
                disabled={completeLoading}
                intent={"success"}
                noScaleOnHover
              >
                {completeLoading ? (
                  <Spinner intent={"white"} />
                ) : (
                  "Confirm Winners"
                )}
              </Button>
            )}
        </div>
      </Modal>
    </>
  );
};

export default ConfirmRoundModal;
