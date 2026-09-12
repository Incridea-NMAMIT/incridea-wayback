import Image from "next/image";
import { AiFillGithub, AiFillInstagram } from "react-icons/ai";
import { RiLinkedinFill } from "react-icons/ri";
import { type GetTechTeamMembersQuery } from "~/generated/generated";


const TechTeamCard = ({ techTeamMember }: {
  techTeamMember: Extract<GetTechTeamMembersQuery["getTechTeamMembers"], {
    __typename: "QueryGetTechTeamMembersSuccess";
  }>["data"][number];
}) => {
  return (
    <div className="flex w-[20rem] gap-4 rounded-xl border border-primary-200/80 bg-primary-500 bg-opacity-20 bg-clip-padding px-5 pt-5 duration-200 hover:scale-[1.02]">
      <div className="flex h-full w-full flex-col gap-4">
        <Image
          src={techTeamMember.imageUrl ?? ""}
          alt={techTeamMember.name}
          height={300}
          width={300}
          className="top-0 aspect-square w-[18rem] rounded-xl object-cover"
        />
        <div>
          <h3 className="text-center font-life-craft text-4xl tracking-wide text-white">
            {techTeamMember.name}
          </h3>
          <h1 className="text-center text-xl font-semibold text-white">
            {techTeamMember.role}
          </h1>
        </div>

        <div className="flex w-full justify-evenly">
          <a
            href={techTeamMember.github ?? "#"}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[#2b6f3d] bg-primary-500 bg-opacity-20 bg-clip-padding p-2 duration-300 hover:scale-105"
          >
            <AiFillGithub className="text-white" size={20} />
          </a>
          <a
            href={techTeamMember.instagram ?? "#"}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[#2b6f3d] bg-primary-500 bg-opacity-20 bg-clip-padding p-2 duration-300 hover:scale-105"
          >
            <AiFillInstagram className="text-white" size={20} />
          </a>
          <a
            href={techTeamMember.linkedin ?? "#"}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[#2b6f3d] bg-primary-500 bg-opacity-20 bg-clip-padding p-2 duration-300 hover:scale-105"
          >
            <RiLinkedinFill className="text-white" size={20} />
          </a>
        </div>

        <div className="relative">
          <svg
            aria-hidden="true"
            className="mb-3 h-12 w-12 text-white opacity-30"
            viewBox="0 0 24 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z"
              fill="currentColor"
            />
          </svg>
          <div className="text-center font-bold italic text-white">{techTeamMember.quote}</div>

          <div className="flex justify-end">
            <svg
              aria-hidden="true"
              className="mb-3 h-12 w-12 rotate-180 text-white opacity-30"
              viewBox="0 0 24 27"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechTeamCard;
