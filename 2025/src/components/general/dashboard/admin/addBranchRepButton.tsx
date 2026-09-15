import { useMutation } from "@apollo/client";
import { type FC } from "react";
import { IoAdd } from "react-icons/io5";

import Button from "~/components/button";
import createToast from "~/components/toast";
import { AddBranchRepDocument } from "~/generated/generated";

const AddBranchRepButton: FC<{
  branchId: string;
  userId: string;
}> = ({ branchId, userId }) => {
  //addBranchRep Mutation
  const [addBranchRepMutation, { loading: addBranchRepLoading }] = useMutation(
    AddBranchRepDocument,
    {
      refetchQueries: ["Branches"],
      awaitRefetchQueries: true,
    },
  );

  const handleAddBranchRep = async () => {
    const promise = addBranchRepMutation({
      variables: {
        branchId: branchId,
        userId: userId,
      },
    }).then(async (res) => {
      if (res.data?.addBranchRep.__typename !== "MutationAddBranchRepSuccess") {
        if (res.data?.addBranchRep.message !== undefined) {
          await createToast(
            Promise.reject(new Error(res.data?.addBranchRep.message)),
            res.data?.addBranchRep.message,
          );
        }
        return Promise.reject(new Error("Error could not add branch rep"));
      }
    });
    await createToast(promise, "Adding BranchRep...");
  };

  return (
    <Button
      intent="success"
      size="medium"
      className="flex items-center gap-1 disabled:cursor-not-allowed disabled:opacity-50"
      onClick={handleAddBranchRep}
      disabled={addBranchRepLoading}
    >
      <IoAdd />
    </Button>
  );
};

export default AddBranchRepButton;
