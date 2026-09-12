import { useQuery } from "@apollo/client";
import { type FC } from "react";

import Spinner from "~/components/spinner";
import { TeamDetailsDocument } from "~/generated/generated";
import { idToPid } from "~/utils/id";

const TeamModal: FC<{
  teamId: string;
}> = ({ teamId }) => {
  const { data: teamDeatils, loading: teamDeatilsLoading } = useQuery(
    TeamDetailsDocument,
    {
      variables: {
        id: teamId,
      },
    },
  );
  return (
    <div className="m-3 flex flex-col justify-center">
      <div className="mb-2 hidden w-full flex-row justify-evenly rounded-lg bg-gray-600 p-2 md:flex">
        <span className="basis-1/4 text-center text-lg font-bold">PID</span>
        <span className="basis-1/4 text-center text-lg font-bold">Name</span>
        <span className="basis-1/4 text-center text-lg font-bold">Email</span>
        <span className="basis-1/5 text-center text-lg font-bold">Phone</span>
        <span className="basis-1/5 text-center text-lg font-bold">College</span>
      </div>
      <div className="h-96 overflow-y-auto md:h-64 md:max-h-72">
        {teamDeatilsLoading && <Spinner />}
        {teamDeatils?.teamDetails.__typename === "QueryTeamDetailsSuccess"
          ? teamDeatils.teamDetails.data.members?.map((member) => (
              <div
                key={member.user.id}
                className="mb-2 flex flex-col justify-start rounded-lg border border-gray-600 p-2 text-base md:flex-row md:justify-center md:text-lg"
              >
                <span className="mb-2 w-full justify-center text-center font-bold md:mb-0 md:w-1/5 md:text-base">
                  {idToPid(member.user.id)}
                </span>
                <span className="mb-2 w-full justify-center text-center font-bold md:mb-0 md:w-1/5 md:text-base">
                  {member.user.name}
                </span>
                <span
                  className="mb-2 w-full justify-center text-center font-bold md:mb-0 md:w-1/5 md:text-base"
                  style={{ wordBreak: "break-all" }}
                >
                  {member.user.email}
                </span>
                <span className="mb-2 w-full justify-center text-center font-bold md:mb-0 md:w-1/5 md:text-base">
                  {member.user.phoneNumber}
                </span>
                <span className="mb-2 w-full justify-center text-center font-bold md:mb-0 md:w-1/5 md:text-base">
                  {member.user.college?.name}
                </span>
              </div>
            ))
          : "No members found"}
        {teamDeatils?.teamDetails.__typename === "QueryTeamDetailsSuccess" &&
          teamDeatils.teamDetails.data.members?.length === 0 && (
            <div className="text-center">No members found</div>
          )}
      </div>
    </div>
  );
};

export default TeamModal;
