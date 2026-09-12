import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React from "react";

import JudgeTab from "~/components/general/dashboard/judge/judgeTab";
import Dashboard from "~/components/layout/dashboard";
import Spinner from "~/components/spinner";
import {
  JudgeCountByJudgeDocument,
  Role,
} from "~/generated/generated";
import { useAuth } from "~/hooks/useAuth";

const Page = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  const { data: judgeCountByJudge, loading: judgeCountByJudgeLoading } = useQuery(JudgeCountByJudgeDocument)

  if (loading || judgeCountByJudgeLoading)
    return (
      <div className="flex h-screen w-screen justify-center">
        <Spinner />
      </div>
    );

  if (!user) {
    void router.push("/login");
    return <div>Redirecting...</div>;
  }

  if (user.role !== Role.Judge && user.role !== Role.Admin) {
    void router.push("/profile");
    return <div>Redirecting...</div>;
  }

  return (
    <Dashboard>
      <JudgeTab shouldPoll={judgeCountByJudge?.judgeCountByJudge.__typename === "QueryJudgeCountByJudgeSuccess" && judgeCountByJudge.judgeCountByJudge.data > 1} />
    </Dashboard>
  );
};

export default Page;
