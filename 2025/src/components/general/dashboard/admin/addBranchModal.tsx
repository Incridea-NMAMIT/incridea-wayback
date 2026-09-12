import { useMutation } from "@apollo/client";
import { useState } from "react";
import { IoAdd } from "react-icons/io5";

import Button from "~/components/button";
import Modal from "~/components/modal";
import createToast from "~/components/toast";
import { AddBranchDocument } from "~/generated/generated";

const AddBranchModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [branchName, setBranchName] = useState<string>("");

  //mutation to add branch
  const [addBranchMutation] = useMutation(AddBranchDocument, {
    variables: {
      name: branchName,
    },
    refetchQueries: ["Branches"],
    awaitRefetchQueries: true,
  });

  const handleBranchAdded = async () => {
    if (branchName === "") return setShowModal(false);

    const promise = addBranchMutation().then((res) => {
      if (res.data?.addBranch.__typename !== "MutationAddBranchSuccess") {
        return Promise.reject(new Error("Error could not add branch"));
      }
    });
    await createToast(promise, "Adding Branch...");
    setShowModal(false);
  };

  return (
    <div>
      <Button
        fullWidth
        intent={"info"}
        size={"large"}
        className="md:mr-2 md:max-h-12"
        onClick={() => setShowModal(true)}
      >
        <IoAdd /> Add Branch
      </Button>

      <Modal
        title="Add Branch"
        size="medium"
        showModal={showModal}
        onClose={() => setShowModal(false)}
      >
        <div className="mb-3 mt-2 flex flex-col items-center justify-center p-5 text-center">
          <input
            type="text"
            id="name"
            onChange={(e) => setBranchName(e.target.value)}
            className="block w-full rounded-lg border border-gray-600 bg-gray-600 p-2.5 text-sm text-white placeholder-gray-400 ring-gray-500 focus:outline-none focus:ring-2"
            placeholder="Branch Name..."
            required
          />
          <div className="mt-4 flex">
            <Button
              intent="danger"
              className="ml-auto justify-center"
              disabled={false}
              onClick={handleBranchAdded}
            >
              <IoAdd /> Add Branch
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddBranchModal;
