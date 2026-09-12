import { type GetStaticProps } from "next";
import TechTeamCard from "~/components/general/about/techTeamCard";
import { GetTechTeamMembersDocument, type GetTechTeamMembersQuery } from "~/generated/generated";
import { client } from "~/lib/apollo";

type Props = | {
  techTeamMembers: Extract<
    GetTechTeamMembersQuery["getTechTeamMembers"],
    {
      __typename: "QueryGetTechTeamMembersSuccess";
    }
  >["data"];
  error?: never;
}
  | {
    techTeamMembers?: never;
    error: string;
  };

const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const { data: techTeamMembers } = await client.query({
      query: GetTechTeamMembersDocument,
      fetchPolicy: "no-cache"
    })

    if (techTeamMembers.getTechTeamMembers.__typename === "Error")
      throw new Error(techTeamMembers.getTechTeamMembers.message);

    return {
      props: {
        techTeamMembers: techTeamMembers.getTechTeamMembers.data,
      },
      revalidate: 60
    }
  } catch (error) {
    console.log(error)
    return {
      props: {
        error: error instanceof Error ? error.message : "Could not fetch techTeamMembers",
      },
      revalidate: 60,
    };
  }
}

const Page = ({ techTeamMembers }: Props) => {
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
        {techTeamMembers?.map((techTeamMember, idx) => (
          <TechTeamCard
            key={idx}
            techTeamMember={techTeamMember}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;

export { getStaticProps };
