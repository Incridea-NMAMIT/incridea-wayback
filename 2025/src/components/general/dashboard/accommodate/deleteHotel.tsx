import { useMutation } from "@apollo/client";
import { type FC, useState } from "react";
import { IoTrash } from "react-icons/io5";

import Button from "~/components/button";
import Modal from "~/components/modal";
import createToast from "~/components/toast";
import { DeleteHotelDocument } from "~/generated/generated";

const DeleteHotel: FC<{
  hotelID: string;
}> = (hotelID) => {
  const [showModal, setShowModal] = useState(false);

  //mutation to remove hotel
  const [deleteHotel] = useMutation(DeleteHotelDocument, {
    refetchQueries: ["Hotel"],
    awaitRefetchQueries: true,
  });

  async function handleDeleteHotel() {
    const promise = deleteHotel({
      variables: {
        id: hotelID.hotelID,
      },
    }).then((res) => {
      if (res.data?.deleteHotel.__typename !== "MutationDeleteHotelSuccess") {
        return Promise.reject(new Error("Error could not delete hotel"));
      }
    });
    await createToast(promise, "Removing Hotel...");
    setShowModal(false);
  }

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center text-end">
          <Button
            intent="danger"
            size="medium"
            className="flex h-12 items-center justify-center gap-1"
            onClick={() => setShowModal(true)}
          >
            <IoTrash />
          </Button>
        </div>
        <Modal
          showModal={showModal}
          onClose={() => setShowModal(false)}
          size="medium"
          title="Delete Hotel"
        >
          <div className="m-3 flex flex-col items-center justify-center">
            <p className="text-center">
              Are you sure you want to delete this hotel?
            </p>
            <div className="mt-4 flex gap-2">
              <Button intent="danger" size="medium" onClick={handleDeleteHotel}>
                Delete
              </Button>
              <Button
                intent="info"
                size="medium"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default DeleteHotel;
