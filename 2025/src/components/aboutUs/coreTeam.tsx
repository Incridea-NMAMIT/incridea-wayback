import CoreTeamCard from "~/components/aboutUs/coreTeamCard";
import { type GetCoreTeamMembersQuery } from "~/generated/generated";

const CoreTeam = ({ coreTeamMembers }: {
  coreTeamMembers: Extract<GetCoreTeamMembersQuery["getCoreTeamMembers"], {
    __typename: "QueryGetCoreTeamMembersSuccess";
  }>["data"]
}) => {
  return (
    <div className="flex flex-col justify-center items-center gap-y-8 bg-transparent pb-10 pt-12">
      <div className="px-4">
        <h1
          className={`text-center font-life-craft text-5xl text-white lg:text-7xl`}
        >
          The Core Team
        </h1>
        <p className="mt-5 text-center text-2xl font-bold text-white lg:text-3xl">
          Meet the people behind the scenes.
        </p>
      </div>
      <div className="mx-auto flex max-w-[80rem] flex-wrap justify-center gap-10 px-2">
        {coreTeamMembers.map((coreTeamMember, idx) => (
          <CoreTeamCard
            key={idx}
            coreTeamMember={coreTeamMember}
          />
        ))}
      </div>
    </div>
  );
};

export default CoreTeam;
