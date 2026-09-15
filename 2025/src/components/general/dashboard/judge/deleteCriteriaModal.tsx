import { useMutation } from "@apollo/client";
import { useState } from "react";
import { BiTrashAlt } from "react-icons/bi";

import Button from "~/components/button";
import Modal from "~/components/modal";
import createToast from "~/components/toast";
import { type Criteria, DeleteCriteriaDocument } from "~/generated/generated";

const DeleteCriteriaModal = ({
  criterias,
  eventId,
  roundNo,
}: {
  criterias: Criteria[] | null | undefined;
  eventId: string;
  roundNo: number;
}) => {
  const [showModal, setShowModal] = useState(false);

  function handleCloseModal() {
    setShowModal(false);
  }

  const [deleteCriteria, { loading: deleteCriteriaLoading }] = useMutation(
    DeleteCriteriaDocument,
    {
      refetchQueries: ["RoundByJudge"],
      awaitRefetchQueries: true,
    },
  );

  const handleDeleteCriteria = async (id: string) => {
    const promise = deleteCriteria({
      variables: {
        eventId: eventId,
        roundNo: roundNo,
        criteriaId: id,
      },
    });
    await createToast(promise, "Deleting criteria...");
  };

  return (
    <div>
      <Button
        onClick={() => {
          setShowModal(true);
        }}
        noScaleOnHover
      >
        Delete <span className="hidden md:block">Criteria</span>
      </Button>
      <Modal
        title={`Delete Criterias`}
        showModal={showModal}
        onClose={handleCloseModal}
        size="medium"
      >
        <div className="flex flex-wrap gap-5 p-5">
          {criterias?.length === 0 && (
            <p className="text-white/60">No criterias to delete</p>
          )}
          {criterias?.map((criteria, index) => (
            <div
              key={index}
              className="mt-2 flex w-[250px] grow flex-col items-center justify-between gap-3 rounded-md bg-white/10 p-5"
            >
              <div className="flex items-center gap-1.5">
                <p className="mr-2 font-semibold text-white/90">
                  {criteria.name}
                </p>
                <Button
                  onClick={async () => await handleDeleteCriteria(criteria.id)}
                  disabled={deleteCriteriaLoading}
                  title="Delete Criteria"
                  intent={"ghost"}
                  className="px-1 hover:bg-red-600/30"
                  size={"small"}
                >
                  <BiTrashAlt size={"1rem"} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default DeleteCriteriaModal;
