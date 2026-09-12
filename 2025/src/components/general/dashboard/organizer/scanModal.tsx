import { type FC, useState } from "react";

import Button from "~/components/button";
import Modal from "~/components/modal";

import { QRCodeScanner } from "./qRCodeScanner";

const ScanModal: FC<{
  eventType: string;
  eventId?: string;
}> = ({ eventType, eventId }) => {
  const [showModal, setShowModal] = useState(false);

  function handleCloseModal() {
    setShowModal(false);
  }

  return (
    <>
      <Button
        intent={"ghost"}
        outline
        size={"large"}
        className="w-full whitespace-nowrap rounded-lg md:w-fit"
        onClick={() => {
          setShowModal(true);
        }}
      >
        Scan
      </Button>
      <Modal title="Scan Team" showModal={showModal} onClose={handleCloseModal}>
        <div className="p-5">
          <QRCodeScanner
            eventId={eventId}
            eventType={eventType}
            intent={"attendance"}
          />
        </div>
      </Modal>
    </>
  );
};

export default ScanModal;
