import { type QueryResult, useMutation } from "@apollo/client";
import { type FC, useState } from "react";
import { IoAdd } from "react-icons/io5";

import Button from "~/components/button";
import { TextInput } from "~/components/input";
import Modal from "~/components/modal";
import createToast from "~/components/toast";
import {
  CreateCardDocument,
  DayType,
  type GetCardsQuery,
  type GetCardsQueryVariables,
} from "~/generated/generated";

const CreateCardModal: FC<{
  cardsRefetch: QueryResult<GetCardsQuery, GetCardsQueryVariables>["refetch"];
}> = ({ cardsRefetch }) => {
  const [showModal, setShowModal] = useState(false);

  function handleCloseModal() {
    setShowModal(false);
  }

  const [createCardMutation, { loading: createCardLoading }] =
    useMutation(CreateCardDocument);

  const handleAddCard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleCloseModal();

    const promise = createCardMutation({
      variables: {
        clue: clue,
        day: day,
      },
    }).then((res) => {
      if (res.data?.createCard.__typename === "MutationCreateCardSuccess") {
        return cardsRefetch();
      }
    });

    await createToast(promise, "Adding card...");
  };

  //Controlled Inputs
  const [clue, setClue] = useState("");
  const [day, setDay] = useState<DayType>(DayType.Day1);

  return (
    <div className="flex items-center justify-center">
      <Button
        fullWidth
        intent={"info"}
        size={"large"}
        onClick={() => setShowModal(true)}
      >
        <IoAdd /> Create Card
      </Button>
      <Modal
        title="Create Card"
        size="medium"
        onClose={handleCloseModal}
        showModal={showModal}
      >
        <form
          onSubmit={handleAddCard}
          className={`flex flex-col gap-5 p-4 md:p-6 ${
            createCardLoading &&
            "pointer-events-none cursor-not-allowed opacity-50"
          }}`}
        >
          <div className="flex items-center gap-3">
            <label className="basis-1/5" htmlFor="eventName">
              Clue
            </label>
            <TextInput
              value={clue}
              onChange={(e) => setClue(e.target.value)}
              id="eventName"
              placeholder="Clue"
              additionalclasses="basis-4/5"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="basis-1/5" htmlFor="eventType">
              Type
            </label>
            <select
              onChange={(e) => {
                setDay(e.target.value as DayType);
              }}
              value={day}
              id="eventType"
              className="h-10 basis-4/5 rounded-lg border-gray-500 bg-gray-600 px-4 pr-16 text-sm ring-gray-500 focus:outline-none focus:ring-2"
            >
              {Object.values(DayType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <Button
            type="submit"
            className="self-end rounded-lg"
            fullWidth={false}
            intent={"info"}
          >
            Create Card
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default CreateCardModal;
