import { type FC, useState } from "react";
import { MdOutlineQrCodeScanner } from "react-icons/md";

import Button from "~/components/button";
import Modal from "~/components/modal";

import { QRCodeScanner } from "./qRCodeScanner";

const ScanParticipantModal: FC<{
  eventId: string;
}> = ({ eventId }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <Button
        onClick={() => setIsOpen(true)}
        intent={"primary"}
        className="w-full"
        outline
        size={"large"}
      >
        Scan <MdOutlineQrCodeScanner className="inline-block text-2xl" />
      </Button>
      <Modal
        title="Scan Participant"
        showModal={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="p-5">
          <QRCodeScanner eventId={eventId} intent="addToEvent" />
        </div>
      </Modal>
    </div>
  );
};

export default ScanParticipantModal;
