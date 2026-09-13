import Image from "next/image";
import { type CoreTeamMember } from "~/archive/team-data";

const CoreTeamCard = ({
  coreTeamMember }: {
  coreTeamMember: CoreTeamMember;
  }) => {
  return (
    <div className="flex w-[20rem] gap-4 rounded-xl border text-white border-primary-200/80 bg-primary-500 bg-opacity-20 pb-12 bg-clip-padding px-5 pt-5 duration-200 hover:scale-[1.02]">
      <div className="flex h-full w-full flex-col gap-4">
        <Image
          src={coreTeamMember.imageUrl ?? ""}
          alt={coreTeamMember.name}
          height={300}
          width={300}
          className="top-0 aspect-square w-[18rem] rounded-xl object-cover"
        />
        <div>
          <h3 className="text-center font-life-craft text-4xl tracking-wide ">
            {coreTeamMember.name}
          </h3>
          <h1 className="text-center text-xl font-semibold ">
            {`${coreTeamMember.designation.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join("-")} | ${coreTeamMember.committee}`}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default CoreTeamCard;
