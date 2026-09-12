import { useMutation } from "@apollo/client";
import { type FC, useState } from "react";
import { IoAdd } from "react-icons/io5";

import Button from "~/components/button";
import Modal from "~/components/modal";
import createToast from "~/components/toast";
import { CreateCollegeDocument } from "~/generated/generated";

const AddCollegeModal: FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [collegeDescription, setCollegeDescription] = useState("");

  const [removeCollege] = useMutation(CreateCollegeDocument, {
    refetchQueries: ["Colleges"],
    awaitRefetchQueries: true,
  });

  async function handleAddCollege() {
    const promise = removeCollege({
      variables: {
        name: name,
        details: collegeDescription,
      },
    }).then((res) => {
      if (
        res?.data?.createCollege.__typename !== "MutationCreateCollegeSuccess"
      )
        return Promise.reject(new Error("Error could not add college"));
    });
    await createToast(promise, "Adding College...");
    setName("");
    setCollegeDescription("");
    setShowModal(false);
  }

  return (
    <>
      <div className="flex items-end justify-end">
        <div className="mt-4 flex w-full">
          <Button
            intent="success"
            className="m-3 mb-5 w-full justify-center"
            fullWidth={true}
            disabled={false}
            onClick={() => setShowModal(true)}
          >
            <IoAdd /> Add College
          </Button>
        </div>
        <Modal
          showModal={showModal}
          onClose={() => setShowModal(false)}
          size="medium"
          title="Add College"
        >
          <div className="m-3 flex w-full flex-col items-start">
            <div className="m-3 flex w-full flex-col items-start">
              <p className="m-2">Name</p>
              <input
                type="text"
                id="name"
                className="block w-11/12 rounded-lg border border-gray-600 bg-gray-600 p-2.5 text-sm text-white placeholder-gray-400 ring-gray-500 focus:outline-none focus:ring-2"
                placeholder="College Name..."
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
                required
              />
            </div>
            <div className="m-3 flex w-full flex-col items-start">
              <p className="m-2">College Description</p>
              <textarea
                id="collegeDescription"
                className="block w-11/12 rounded-lg border border-gray-600 bg-gray-600 p-2.5 py-10 text-sm text-white placeholder-gray-400 ring-gray-500 focus:outline-none focus:ring-2"
                placeholder="College Description..."
                onChange={(e) => {
                  setCollegeDescription(e.target.value);
                }}
                value={collegeDescription}
              />
            </div>
          </div>
          <div className="m-3 flex items-center justify-center">
            <Button
              intent="success"
              size="large"
              className="flex items-center gap-1 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleAddCollege}
            >
              Create
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default AddCollegeModal;
