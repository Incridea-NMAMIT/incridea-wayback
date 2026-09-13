import TechTeamCard from "~/components/general/about/techTeamCard";
import { technicalTeam } from "~/archive/team-data";

const Page = () => {
  return (
    <div className="flex min-h-screen flex-col gap-y-8 bg-transparent pb-10 pt-32">
      <div className="px-4">
        <h1
          className={`text-center font-life-craft text-5xl text-white lg:text-6xl`}
        >
          Incridea&apos;s Technical Team
        </h1>
        <p className="mt-5 text-center text-2xl font-bold text-white lg:text-3xl">
          Meet the developers
        </p>
      </div>
      <div className="mx-auto flex max-w-[80rem] flex-wrap justify-center gap-10 px-2">
        {technicalTeam.map((techTeamMember) => (
          <TechTeamCard
            key={techTeamMember.name}
            techTeamMember={techTeamMember}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
