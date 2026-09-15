import { type FC, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";

import Button from "~/components/button";
import Modal from "~/components/modal";
import { idToPid } from "~/utils/id";

import TeamModal from "./teamModal";

const VieweventModal: FC<{
  teamId: string;
  modalTitle: string;
  modalResult: string;
  teamName: string;
  eventType: string;
}> = ({ teamId, modalTitle, modalResult, teamName, eventType }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)} intent="secondary">
        <AiOutlineEye />
        {eventType === "INDIVIDUAL" || eventType === "INDIVIDUAL_MULTIPLE_ENTRY"
          ? idToPid(teamName)
          : teamName}
      </Button>
      <Modal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        title={modalResult.replaceAll("_", " ") + " - " + modalTitle}
      >
        <TeamModal teamId={teamId} />
      </Modal>
    </>
  );
};

export default VieweventModal;
