import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Dashboard from "~/components/layout/dashboard";
import Spinner from "~/components/spinner";
import { EventByOrganizerDocument } from "~/generated/generated";
import { GetQuizScoresDocument } from "~/generated/generated";
import { PromoteQuizParticipantsDocument } from "~/generated/generated";
import { useAuth } from "~/hooks/useAuth";
import { Role } from "~/generated/generated";
import { idToTeamId, teamIdToId } from "~/utils/id";
import {
  AiOutlineClose,
  AiOutlineCheck,
  AiOutlineSearch,
} from "react-icons/ai";
import { Button } from "~/components/ui/button";
import createToast from "~/components/toast";

type Leaderboard = {
  score: number;
  teamName: string;
  teamId: string;
  timeTaken: number;
  selected: boolean;
};

const QuizLeaderboard = () => {
  const router = useRouter();
  const { user, loading: loading2 } = useAuth();
  const { slug } = router.query;
  const [eventId, roundId] = slug?.toString().split("-") ?? [];
  const roundInt = parseInt(roundId ?? "0");

  const [query, setQuery] = useState<string>("");
  const [sortedLeaderboard, setSortedLeaderboard] = useState<Leaderboard[]>([]);
  const [processedQuizScores, setProcessedQuizScores] = useState(false);

  const { data } = useQuery(EventByOrganizerDocument);

  const event = data?.eventByOrganizer.__typename === "QueryEventByOrganizerSuccess" ? data.eventByOrganizer.data.find((event) => event.id === eventId) : undefined;
  const round = event?.rounds.find((round) => round.roundNo === roundInt);
  const quizId = round?.quiz?.id;

  const { data: quizScores, loading: quizScoresLoading } = useQuery(
    GetQuizScoresDocument,
    {
      variables: { quizId },
      skip: !quizId,
    },
  );

  const [promoteQuizParticipants, { loading: promoteQuizParticipantsLoading }] =
    useMutation(PromoteQuizParticipantsDocument);

  useEffect(() => {
    if (
      quizScores?.getQuizScores.__typename === "QueryGetQuizScoresSuccess" &&
      !processedQuizScores
    ) {
      const scores = quizScores.getQuizScores.data;
      const qualifyNext = scores[0]?.quiz.qualifyNext ?? 5;

      console.log(scores);

      const leaderboard = scores.map((score) => ({
        score: score.score,
        teamName: score.team.name,
        teamId: idToTeamId(score.teamId.toString()),
        timeTaken: score.timeTaken,
        selected: false,
      }));

      leaderboard.sort((a, b) => {
        if (a.score === b.score) {
          return a.timeTaken - b.timeTaken;
        }
        return b.score - a.score;
      });

      leaderboard.forEach((user, i) => {
        user.selected = i < qualifyNext;
      });

      setSortedLeaderboard(leaderboard);
      console.log(sortedLeaderboard);
      setProcessedQuizScores(true);
    }
  }, [quizScores, processedQuizScores]);

  useEffect(() => {
    if (user && user.role !== Role.Organizer) {
      router.push("/profile").catch((err) => {
        console.error("Failed to redirect to profile", err);
      });
    }
  }, [user, router]);

  const handlePromote = async () => {
    const promise = promoteQuizParticipants({
      variables: {
        quizId,
        teams: sortedLeaderboard
          .filter((team) => team.selected)
          .map((team) => parseInt(teamIdToId(team.teamId) ?? "0")),
        eventId: parseInt(eventId ?? "0"),
        roundId: roundInt,
      },
    })
      .then((res) => {
        if (
          res.data?.promoteQuizParticipants.__typename ===
          "MutationPromoteQuizParticipantsSuccess"
        ) {
          console.log("Promoted successfully");
          router.reload();
        } else {
          console.error("Failed to promote", res.errors);
          throw new Error("Failed to promote participants/teams");
        }
      })
      .catch(async (err) => {
        console.error("Failed to promote", err);
        const errorMessage =
          err instanceof Error ? err : new Error(String(err));
        await createToast(
          Promise.reject(errorMessage),
          "Failed to promote participants/teams",
        );
      });

    await createToast(Promise.resolve(promise), "Promoting participants...");
  };

  if (loading2) {
    return (
      <div className="flex h-screen w-screen justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    void router.push("/login");
    return <div>Redirecting...</div>;
  }

  if (quizScores?.getQuizScores.__typename === "Error") {
    return (
      <div className="w-full h-screen flex justify-center items-center text-3xl">
        {quizScores.getQuizScores.message}
      </div>
    );
  }

  return (
    <Dashboard>
      <div
        className={``}
        style={{ willChange: "transform", overflowX: "hidden" }}
      >
        <h1 className="w-fit mx-auto text-3xl lg:text-5xl text-amber-400 border-b-[1.45px] border-b-amber-400">
          Leaderboards
        </h1>
        <div className="relative min-h-screen mt-6">
          <p className="w-fit mr-auto font-sans text-4xl bg-gradient-to-tr from-amber-600 to-amber-400 via-amber-500 bg-clip-text text-transparent md:text-4xl font-bold ">
            Hello, {user.name}
          </p>
          <div className="text-right mt-6 p-2 ">
            <p className="w-fit mx-auto text-2xl md:text-4xl bg-gradient-to-tr from-amber-600 to-amber-400 via-amber-500 bg-clip-text text-transparent">
              {round?.quiz?.name} of {event?.name}(Round {round?.roundNo})
            </p>
          </div>
          <div className="relative min-h-screen flex gap-x-4 mt-6">
            {quizScoresLoading && (
              <div className="mt-10 flex items-center justify-center">
                <Spinner className="text-amber-300/90" />
              </div>
            )}

            <div className="w-1/2 bg-gradient-to-bl from-emerald-900/90 to-green-800/95 via-emerald-800/90 rounded-3xl overflow-clip h-screen shadow-2xl border-[1.5px] border-amber-200">
              <div className="h-20 flex w-full bg-[#1a3d16] text-3xl items-center p-4 relative">
                <input
                  className="h-full border-2 border-amber-600/30 bg-emerald-900/20 text-xl p-2 w-full rounded-md text-amber-100 placeholder-amber-300/50 focus-within:outline-double"
                  placeholder="Search by name or PID"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="text"
                />
                <AiOutlineSearch
                  size={"1.4rem"}
                  className="absolute right-7 text-amber-300/60"
                />
              </div>
              <div className="m-4 grid grid-cols-5 h-16 items-center rounded-lg rounded-t-lg bg-emerald-900/95 bg-opacity-30 text-sm font-bold text-amber-100 text-center md:text-xl">
                <h1>Name</h1>
                <h1>ID</h1>
                <h1>Score</h1>
                <h1>Duration</h1>
                <h1>Promote</h1>
              </div>
              <div className="overflow-y-scroll h-[80%] pb-10">
                {sortedLeaderboard
                  .filter(
                    (team) =>
                      team.teamName
                        .toLowerCase()
                        .includes(query.toLowerCase()) ||
                      team.teamId.toLowerCase().includes(query.toLowerCase()),
                  )
                  .map((user) => {
                    return (
                      !user.selected && (
                        <div
                          key={user.teamId}
                          className="h-16 mx-4 my-2 grid grid-cols-5 items-center justify-items-center rounded-lg shadow-xl text-sm md:text-xl bg-emerald-800/30 hover:bg-emerald-700/40 transition-all duration-300 text-amber-100"
                        >
                          <p>{user.teamName}</p>
                          <p>{user.teamId}</p>
                          <p>{user.score}</p>
                          <p>{user.timeTaken.toFixed(3)}</p>
                          <Button
                            className={`h-8 w-8 bg-emerald-600 hover:bg-emerald-500 justify-self-center aspect-square p-1 transition-all duration-300 transform hover:scale-110`}
                            onClick={() => {
                              const leaderboard = [...sortedLeaderboard];
                              leaderboard.forEach((team) => {
                                if (team.teamId === user.teamId)
                                  team.selected = true;
                              });
                              setSortedLeaderboard(leaderboard);
                            }}
                          >
                            <AiOutlineCheck className="text-amber-100" />
                          </Button>
                        </div>
                      )
                    );
                  })}
              </div>
            </div>
            <div className="w-1/2 bg-gradient-to-tr from-green-500/90 to-emerald-600/95 via-emerald-600  overflow-clip h-screen shadow-2xl rounded-3xl">
              <div className="h-20 flex w-full text-3xl items-center p-4 bg-[#133d0f] text-amber-100">
                Selected Teams
              </div>
              <div className="m-4 grid grid-cols-9 h-16 justify-items-center items-center rounded-lg rounded-t-lg bg-amber-900/30 text-sm font-bold text-amber-100 md:text-xl">
                <h1 className="col-span-2">Name</h1>
                <h1 className="col-span-2">ID</h1>
                <h1 className="col-span-2">Score</h1>
                <h1 className="col-span-2">Duration</h1>
              </div>
              <div className="overflow-y-scroll h-[70%] pb-10">
                {sortedLeaderboard.map((user, i) => {
                  return (
                    user.selected && (
                      <div
                        key={user.teamId}
                        className="h-16 mx-4 my-2 grid grid-cols-9 items-center rounded-lg shadow-xl justify-items-center text-sm md:text-xl bg-amber-800/30 hover:bg-amber-700/40 transition-all duration-300 text-amber-100"
                      >
                        <h1 className="col-span-2">{user.teamName}</h1>
                        <h1 className="col-span-2">{user.teamId}</h1>
                        <h1 className="col-span-2">{user.score}</h1>
                        <h1 className="col-span-2">
                          {user.timeTaken.toFixed(3)}
                        </h1>
                        <Button
                          className="bg-red-700 right-0 mx-[5%] aspect-square p-1 hover:bg-red-600 transition-all duration-300 transform hover:scale-110"
                          onClick={() => {
                            const leaderboard = [...sortedLeaderboard];
                            leaderboard.forEach((team) => {
                              if (team.teamId === user.teamId)
                                team.selected = false;
                            });
                            setSortedLeaderboard(leaderboard);
                          }}
                        >
                          <AiOutlineClose className="text-amber-100" />
                        </Button>
                      </div>
                    )
                  );
                })}
              </div>
              {sortedLeaderboard.filter((team) => team.selected).length > 0 && (
                <Button
                  className="px-8 py-3 text-[1rem] min-w-[12rem] text-center ml-10 md:text-[20px]
                  bg-amber-500 hover:bg-orange-400/90
                  text-amber-100
                  transition-all duration-300
                  hover:opacity-90
                  relative
                  before:absolute before:inset-0
                  before:bg-amber-500
                  before:skew-x-[20deg]
                  before:-z-10
                  hover:before:bg-orange-400/90"
                  style={{
                    clipPath: "polygon(5% 0%, 90% 0%, 85% 100%, 2% 100%)",
                  }}
                  onClick={handlePromote}
                >
                  <span className="relative z-10 mr-4">
                    {promoteQuizParticipantsLoading
                      ? "Promoting..."
                      : "Confirm Teams"}
                  </span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default QuizLeaderboard;
