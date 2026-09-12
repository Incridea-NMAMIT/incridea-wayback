import { type FC } from "react";
import { useState } from "react";
import { IoAdd } from "react-icons/io5";

import Button from "~/components/button";
import Modal from "~/components/modal";
import {
  type BranchesQuery,
} from "~/generated/generated";

import AddBranchRepModal from "./addBranchRepModal";

const AddBranchRep: FC<{
  branchId: string;
  branchName: string;
  branchReps: Extract<
    BranchesQuery["getBranches"],
    { __typename: "QueryGetBranchesSuccess" }
  >["data"][number]["branchReps"];
}> = ({ branchId, branchName, branchReps }) => {
  const [showModal, setShowModal] = useState(false);

  function handleCloseModal() {
    setShowModal(false);
  }

  return (
    <div className="flex items-center justify-center">
      <Button
        intent="success"
        size="medium"
        className="flex items-center gap-1 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => setShowModal(true)}
      >
        <IoAdd /> Add
      </Button>
      <Modal
        showModal={showModal}
        onClose={handleCloseModal}
        size="medium"
        title="Add Branch Representative"
      >
        <AddBranchRepModal
          branchId={branchId}
          branchName={branchName}
          branchReps={branchReps}
        />
      </Modal>
    </div>
  );
};

export default AddBranchRep;
