import React, { type FC, useState } from "react";
import { BiEditAlt } from "react-icons/bi";

import Badge from "~/components/badge";
import Button from "~/components/button";
import DeleteTeamMember from "~/components/general/profile/deleteMember";
import DeleteTeamModal from "~/components/general/profile/deleteTeam";
import Modal from "~/components/modal";
import { type QueryMyTeamSuccess } from "~/generated/generated";
import { idToTeamId } from "~/utils/id";

import AddMemberModal from "./addMemberModal";

const EditTeamModal: FC<{
  team: QueryMyTeamSuccess["data"];
  userId: string;
}> = ({ team, userId }) => {
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        intent={"primary"}
        className="!skew-x-0 !justify-center rounded-full !tracking-normal"
        size={"small"}
      >
        <BiEditAlt />
      </Button>
      <Modal
        title={`${team.name}`}
        showModal={showModal}
        onClose={handleCloseModal}
        size={"medium"}
      >
        <div className="w-full p-5">
          <div className="text-center">
            <h1 className={`mb-5 text-2xl`}>{idToTeamId(team.id)}</h1>
          </div>

          <div className="hidden items-center justify-between rounded-t-lg bg-white/20 bg-clip-padding p-1 font-bold backdrop-blur-lg backdrop-filter md:flex">
            <h1 className="w-full py-1 text-center">Member</h1>
            <h1 className="w-full py-1 text-center">Role</h1>
            <h1 className="w-full py-1 text-center">Remove</h1>
          </div>

          {team?.members?.map((member, index) => (
            <div
              className={`mt-0.5 flex items-center justify-between gap-2 rounded-sm bg-white/20 p-2 backdrop-blur-lg backdrop-filter ${
                index === team.members.length - 1 ? "rounded-b-lg" : ""
              }`}
              key={member.user.id}
            >
              <h1 className="w-full text-center">{member.user.name}</h1>{" "}
              <div className="w-full text-center">
                <Badge
                  color={
                    member.user.id === team.leaderId?.toString()
                      ? "success"
                      : "info"
                  }
                >
                  {member.user.id === team.leaderId?.toString()
                    ? "Leader"
                    : "Member"}
                </Badge>
              </div>
              {!team.confirmed && team.leaderId?.toString() == userId && (
                <DeleteTeamMember
                  teamId={team.id}
                  userId={member.user.id}
                  name={member.user.name}
                  editable={!(member.user.id == userId)}
                />
              )}
            </div>
          ))}
          <div className="flex justify-center">
            {!team.confirmed &&
              team.members.length < team.event.maxTeamSize && (
                <AddMemberModal team={team} />
              )}
          </div>
        </div>
        {!team.confirmed &&
          team.leaderId &&
          team.leaderId.toString() == userId && (
            <div className="p-5">
              <DeleteTeamModal
                teamId={team.id}
                isLeader={team.leaderId.toString() == userId}
              />
            </div>
          )}
      </Modal>
    </>
  );
};

export default EditTeamModal;
