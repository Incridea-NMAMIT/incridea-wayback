import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { type FC, useState } from "react";
import { BiTrashAlt } from "react-icons/bi";
import { BsFillEyeFill } from "react-icons/bs";
import { MdOutlineDeleteOutline, MdOutlineMail } from "react-icons/md";

import Badge from "~/components/badge";
import Button from "~/components/button";
import Modal from "~/components/modal";
import Spinner from "~/components/spinner";
import createToast from "~/components/toast";
import {
  OrganizerDeleteTeamMemberDocument,
  TeamDetailsDocument,
} from "~/generated/generated";
import { idToPid } from "~/utils/id";

import AddTeamMember from "./addTeamMember";

const ViewTeamModal: FC<{
  teamId: string;
  teamName: string;
}> = ({ teamId, teamName }) => {
  const [showModal, setShowModal] = useState(false);

  const { data: teamData } = useQuery(TeamDetailsDocument, {
    variables: {
      id: teamId,
    },
  });

  const teamSize =
    teamData?.teamDetails.__typename === "QueryTeamDetailsSuccess"
      ? teamData?.teamDetails.data.members.length
      : 0;

  function handleCloseModal() {
    setShowModal(false);
  }

  const [deleteMember] = useMutation(OrganizerDeleteTeamMemberDocument, {
    refetchQueries: ["TeamDetails"],
    awaitRefetchQueries: true,
  });

  const removeMember = async (id: string) => {
    const promise = deleteMember({
      variables: {
        teamId: teamId,
        userId: id,
      },
    }).then((res) => {
      if (
        res.data?.organizerDeleteTeamMember.__typename !==
        "MutationOrganizerDeleteTeamMemberSuccess"
      ) {
        return Promise.reject(new Error("Error could not remove team member"));
      }
    });
    await createToast(promise, "Removing Team member...");
  };

  return (
    <div>
      <Button
        onClick={() => setShowModal(true)}
        className="h-auto w-6 md:w-auto"
      >
        <BsFillEyeFill />
      </Button>
      <Modal
        title="Team Details"
        showModal={showModal}
        onClose={handleCloseModal}
        size="medium"
      >
        <div className="flex flex-col p-5">
          <div className="flex flex-col justify-start">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">{teamName}</h2>
              <div className="flex items-center justify-end gap-2">
                <AddTeamMember teamId={teamId} teamName={teamName} />
                <Badge
                  className="w-fit"
                  color={teamSize === 0 ? "danger" : "success"}
                >
                  {teamSize === 0 ? "No Members" : `${teamSize} Members`}
                </Badge>
              </div>
            </div>
            <div className="just mt-5 flex flex-col gap-3">
              {teamData &&
              teamData.teamDetails.__typename === "QueryTeamDetailsSuccess" ? (
                teamData?.teamDetails.data.members?.map((member) => (
                  <div
                    key={member.user.id}
                    className="flex flex-col items-start justify-between gap-3 rounded-lg bg-white bg-opacity-10 bg-clip-padding p-3 backdrop-blur-lg backdrop-filter md:h-28 md:flex-row md:items-center md:gap-5 md:p-5"
                  >
                    <div className="flex flex-col gap-1">
                      <Badge color={"info"}>{idToPid(member.user.id)}</Badge>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1 text-sm text-gray-400">
                        Name
                      </span>
                      {member.user.name}
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1 text-sm text-gray-400">
                        Name
                      </span>
                      {member.user.college?.name}
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1 text-sm text-gray-400">
                        Email
                        <MdOutlineMail />
                      </span>
                      <Link
                        href={`mailto:${member.user.email}`}
                        className="hover:underline"
                      >
                        {member.user.email}
                      </Link>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1 text-sm text-gray-400">
                        Phone
                        <MdOutlineMail />
                      </span>
                      <Link
                        href={`mailto:${member.user.phoneNumber}`}
                        className="hover:underline"
                      >
                        {member.user.phoneNumber}
                      </Link>
                    </div>

                    <div className="flex flex-col gap-1 md:mt-3">
                      <span className="flex items-center gap-1 text-sm text-gray-400">
                        Delete
                        <MdOutlineDeleteOutline />
                      </span>
                      <Button
                        intent="danger"
                        size={"medium"}
                        outline
                        onClick={async () => await removeMember(member.user.id)}
                        className="w-full"
                      >
                        <BiTrashAlt className="text-white" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <Spinner />
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ViewTeamModal;
