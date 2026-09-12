import { useMutation } from "@apollo/client";
import { type FC, useState } from "react";

import Button from "~/components/button";
import { TextInput } from "~/components/input";
import Modal from "~/components/modal";
import Spinner from "~/components/spinner";
import createToast from "~/components/toast";
import { CreateCriteriaDocument, CriteriaType } from "~/generated/generated";

const CreateCriteriaModal: FC<{
  eventId: string;
  roundNo: number;
}> = ({ eventId, roundNo }) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState(CriteriaType.Number);

  function handleCloseModal() {
    setShowModal(false);
  }

  const [createCriteria, { loading }] = useMutation(CreateCriteriaDocument);

  const handleCreateCriteria = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const promise = createCriteria({
      variables: {
        name,
        type,
        eventId,
        roundNo,
      },
      refetchQueries: ["RoundByJudge"],
      awaitRefetchQueries: true,
    }).then((res) => {
      if (
        res.data?.createCriteria.__typename === "MutationCreateCriteriaSuccess"
      ) {
        setName("");
        setType(CriteriaType.Number);
        handleCloseModal();
      } else {
        console.log(res.data?.createCriteria.message);
        throw new Error("Error creating criteria");
      }
    });
    await createToast(promise, `Adding criteria...`);
  };

  return (
    <div>
      <Button
        onClick={() => {
          setShowModal(true);
        }}
        noScaleOnHover
      >
        Create <span className="hidden md:block">Criteria</span>
      </Button>
      <Modal
        title={`Create Criteria`}
        showModal={showModal}
        onClose={handleCloseModal}
        size="medium"
      >
        <div
          className={`p-5 ${
            loading && "pointer-events-none cursor-not-allowed opacity-50"
          }`}
        >
          <form className="flex flex-col gap-5" onSubmit={handleCreateCriteria}>
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Criteria Name</label>
              <TextInput
                name="name"
                placeholder="Enter criteria name (optional)"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <span className="text-xs text-gray-500">
                (If not provided, will be auto-generated as &quot;criteria
                1&quot;, &quot;criteria 2&quot;, etc.)
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="type">Criteria Type</label>
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value as CriteriaType);
                }}
                className="h-10 rounded-lg border-gray-500 bg-gray-600 px-4 pr-16 text-sm ring-gray-500 focus:outline-none focus:ring-2"
              >
                {Object.values(CriteriaType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <Button className="rounded-lg" type="submit">
                {loading ? (
                  <>
                    <Spinner intent={"white"} size={"small"} />
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default CreateCriteriaModal;
