import { useState } from "react";
import { AiFillEye } from "react-icons/ai";

import Button from "~/components/button";
import Modal from "~/components/modal";
import { idToPid } from "~/utils/id";

const ViewTeamModal = ({
  teamName,
  members,
}: {
  teamName: string;
  members: {
    __typename?: "TeamMember" | undefined;
    user: {
      __typename?: "User" | undefined;
      id: string;
    };
  }[];
}) => {
  const [showModal, setShowModal] = useState(false);

  function handleCloseModal() {
    setShowModal(false);
  }
  return (
    <>
      <Button onClick={() => setShowModal(true)} size={"small"}>
        <AiFillEye className="text-white/60" />
      </Button>
      <Modal
        title={`${teamName} Details`}
        showModal={showModal}
        onClose={handleCloseModal}
        size="small"
      >
        <div className="flex flex-wrap justify-center gap-2 px-5 py-3">
          {members.map((member) => {
            return (
              <div
                key={member.user.id}
                className="flex w-fit flex-1 items-center justify-between rounded-lg bg-gray-600 p-3"
                style={{ minWidth: "200px" }}
              >
                <div className="flex items-center">
                  <p className="ml-2 text-sm font-medium">
                    {idToPid(member.user.id)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
};

export default ViewTeamModal;
