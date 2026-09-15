import { useLazyQuery, useQuery } from "@apollo/client";
import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
} from "react";
import { BiLoader } from "react-icons/bi";

import { type Question } from "~/pages/event/[slug]/quiz/[quizId]";

import {
  AttemptQuizDocument,
  GetQuizByIdDocument,
  VerifyQuizPasswordDocument,
} from "~/generated/generated";

const IntroductionPage = ({
  setIsVerified,
  quizId,
  setName,
  setDescription,
  setStartTime,
  setEndTime,
  setMyTeamId,
  setOverridePassword,
}: {
  setIsVerified: Dispatch<SetStateAction<boolean>>;
  setQuestions: Dispatch<SetStateAction<Question[]>>;
  setName: Dispatch<SetStateAction<string>>;
  setDescription: Dispatch<SetStateAction<string>>;
  setStartTime: Dispatch<SetStateAction<Date>>;
  setEndTime: Dispatch<SetStateAction<Date>>;
  quizId: string;
  setMyTeamId: Dispatch<SetStateAction<number>>;
  setOverridePassword: Dispatch<SetStateAction<string>>;
}) => {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [teamId, setTeamId] = useState(0);
  const [hasQuizStarted, setHasQuizStarted] = useState(false);
  const [hasQuizEnded, setHasQuizEnded] = useState(false);
  const [attended, setAttended] = useState(true);

  const [quizData, setQuizData] = useState<{
    __typename?: "Quiz";
    description?: string | null;
    endTime: Date;
    name: string;
    startTime: Date;
    overridePassword: string;
  } | null>(null);

  const { loading: attemptQuizLoading, data: attemptQuizData } = useQuery(
    AttemptQuizDocument,
    {
      variables: { quizId: quizId },
    },
  );

  const { loading: quizLoading, data: quiz } = useQuery(GetQuizByIdDocument, {
    variables: { id: quizId },
    skip: !attemptQuizData,
  });

  const [verifyQuizPassword, { loading: verifyQuizLoading }] = useLazyQuery(
    VerifyQuizPasswordDocument,
  );

  const handlePasswordSubmit = async () => {
    try {
      const { data } = await verifyQuizPassword({
        variables: { password: password, quizId: quizId },
      });
      if (
        data?.verifyQuizPassword.__typename === "QueryVerifyQuizPasswordSuccess"
      ) {
        setErrorMessage("");
        setIsVerified(true);
        localStorage.setItem("quizStartTime", new Date().toISOString());
      } else {
        setErrorMessage("Invalid password. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setPassword("");
    }
  };

  useEffect(() => {
    if (attemptQuizData?.attemptQuiz.__typename === "QueryAttemptQuizSuccess") {
      const teamId = attemptQuizData.attemptQuiz.data.id;
      setTeamId(parseInt(teamId));
      setMyTeamId(parseInt(teamId));
      setAttended(attemptQuizData.attemptQuiz.data.attended);
    }

    if (quiz?.getQuizById.__typename === "QueryGetQuizByIdSuccess") {
      setQuizData(quiz.getQuizById.data);
      setStartTime(new Date(quiz.getQuizById.data.startTime));
      setEndTime(new Date(quiz.getQuizById.data.endTime));
      setName(quiz.getQuizById.data.name);
      setOverridePassword(quiz.getQuizById.data.overridePassword);
      if (quiz.getQuizById.data.description)
        setDescription(quiz.getQuizById.data.description);
      const currentTime = new Date();
      const quizStartTime = new Date(quiz.getQuizById.data.startTime);
      const quizEndTime = new Date(quiz.getQuizById.data.endTime);
      if (currentTime >= quizStartTime && currentTime <= quizEndTime)
        setHasQuizStarted(true);
      else if (currentTime > quizEndTime) setHasQuizEnded(true);
      if (localStorage.getItem(`selectionOptions-${teamId}-${quizId}`) !== null)
        setIsVerified(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptQuizData, quiz]);

  if (attemptQuizLoading || quizLoading) {
    return (
      <div className="grid h-screen w-full items-center justify-center text-3xl">
        <BiLoader
          size={100}
          className="h-6 w-6 animate-spin text-primary-500"
        />
      </div>
    );
  }

  if (attemptQuizData?.attemptQuiz.__typename === "Error") {
    return (
      <div className="grid h-screen w-full items-center justify-center text-3xl">
        <p>{attemptQuizData.attemptQuiz.message}</p>
      </div>
    );
  }

  if (quiz?.getQuizById.__typename === "Error") {
    return (
      <div className="grid h-screen w-full items-center justify-center text-3xl">
        <p>{quiz.getQuizById.message}</p>
      </div>
    );
  }

  return (
    <div className="via-[#002e1c]] flex min-h-screen flex-col items-center justify-evenly bg-gradient-to-br from-[#003d1c] to-[#004e2c] p-4">
      <h2 className="mx-auto w-fit bg-gradient-to-r from-orange-400 via-yellow-400 to-amber-500 bg-clip-text text-3xl font-bold text-transparent drop-shadow-md lg:text-5xl">
        {quizData?.name}
      </h2>

      <div className="mx-auto overflow-hidden rounded-2xl border border-white/30 bg-amber-200/20 shadow-xl backdrop-blur-lg lg:w-1/2">
        {" "}
        <div className="p-6 text-center">
          <div className="mt-4 rounded-xl bg-white/10 p-6">
            <h2 className="mb-4 text-xl font-semibold text-amber-300">
              Password Required
            </h2>

            {/* Password Input */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-[1rem] text-white/80"
                >
                  Enter Quiz Password:
                </label>
                <input
                  type="password"
                  id="password"
                  disabled={hasQuizEnded || !hasQuizStarted || !attended}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mx-auto w-3/4 rounded-md border border-white/30 bg-white/20 px-4 py-2 text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter your password"
                />
                {errorMessage && (
                  <p className="mt-2 text-sm font-medium text-red-300">
                    {errorMessage}
                  </p>
                )}
              </div>

              {/* Rules Section */}
              <div className="mt-4 rounded-md bg-white/10 p-4">
                <p className="mx-auto mb-2 w-fit border-b-[1px] border-amber-400 text-lg font-semibold text-amber-300">
                  Quiz Rules:
                </p>
                <p className="text-pretty text-[1rem] text-gray-100">
                  {quizData?.description}
                </p>
              </div>
            </div>

            {/* Action Section */}
            <div className="mt-6">
              {!attended ? (
                <div className="text-center font-medium text-white">
                  You must be present at the venue to attempt the quiz
                </div>
              ) : hasQuizEnded ? (
                <div className="text-center font-medium text-white">
                  Quiz has ended
                </div>
              ) : (
                <>
                  {!hasQuizStarted ? (
                    <div className="text-center font-medium text-white">
                      Quiz has not yet started
                    </div>
                  ) : (
                    <button
                      onClick={handlePasswordSubmit}
                      disabled={verifyQuizLoading || !password}
                      className="mx-auto mt-6 flex w-3/4 items-center justify-center rounded-full bg-amber-500 py-2 text-white transition-colors duration-300 hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-slate-400 lg:w-1/2"
                    >
                      {verifyQuizLoading ? (
                        <BiLoader className="h-6 w-6 animate-spin" />
                      ) : (
                        "Submit Password"
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroductionPage;
