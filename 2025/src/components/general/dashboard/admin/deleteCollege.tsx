import { useMutation } from "@apollo/client";
import { type FC, useState } from "react";
import { IoTrash } from "react-icons/io5";

import Button from "~/components/button";
import Modal from "~/components/modal";
import createToast from "~/components/toast";
import { RemoveCollegeDocument } from "~/generated/generated";

const DeleteCollege: FC<{
  collegeId: string;
}> = (collegeId) => {
  const [showModal, setShowModal] = useState(false);

  //mutation to remove college
  const [removeCollege] = useMutation(RemoveCollegeDocument, {
    refetchQueries: ["Colleges"],
    awaitRefetchQueries: true,
  });

  async function handleDeleteCollege() {
    const promise = removeCollege({
      variables: {
        id: collegeId.collegeId,
      },
    }).then((res) => {
      if (
        res.data?.removeCollege.__typename !== "MutationRemoveCollegeSuccess"
      ) {
        return Promise.reject(new Error("Error could not delete college"));
      }
    });
    await createToast(promise, "Removing College...");
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
          title="Delete College"
        >
          <div className="m-3 flex flex-col items-center justify-center">
            <p className="text-center">
              Are you sure you want to delete this college?
            </p>
            <div className="mt-4 flex gap-2">
              <Button
                intent="danger"
                size="medium"
                onClick={handleDeleteCollege}
              >
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

export default DeleteCollege;
