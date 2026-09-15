import { useMutation } from "@apollo/client";
import { type FC, useState } from "react";
import { BiTrash } from "react-icons/bi";

import Button from "~/components/button";
import Modal from "~/components/modal";
import createToast from "~/components/toast";
import { DeleteEventDocument } from "~/generated/generated";

const DeleteEvent: FC<{
  eventId: string;
  published: boolean;
}> = ({ eventId, published }) => {
  // Delete Event Mutation
  const [deleteEventMutation, { loading: deleteEventLoading }] = useMutation(
    DeleteEventDocument,
    {
      refetchQueries: ["EventsByBranchRep"],
      awaitRefetchQueries: true,
    },
  );

  const [showModal, setShowModal] = useState(false);

  function handleCloseModal() {
    setShowModal(false);
  }

  // Delete Event Handler
  const handleDeleteEvent = async () => {
    handleCloseModal();
    const promise = deleteEventMutation({
      variables: {
        id: parseInt(eventId),
      },
    }).then((res) => {
      if (res.data?.deleteEvent.__typename !== "MutationDeleteEventSuccess") {
        return Promise.reject(new Error("Error deleting event"));
      }
    });
    await createToast(promise, "Deleting event...");
  };

  return (
    <>
      <Button
        intent={"danger"}
        className="ml-auto"
        disabled={published || deleteEventLoading}
        onClick={() => setShowModal(true)}
      >
        Delete <BiTrash />
      </Button>
      <Modal
        title="Are you sure you want to delete this event?"
        size="small"
        onClose={handleCloseModal}
        showModal={showModal}
      >
        <div className="my-5 flex justify-center gap-3">
          <Button
            intent={"danger"}
            onClick={handleDeleteEvent}
            disabled={deleteEventLoading}
          >
            Delete
          </Button>
          <Button intent={"secondary"} onClick={() => handleCloseModal()}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default DeleteEvent;
