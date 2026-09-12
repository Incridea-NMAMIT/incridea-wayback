import { useMutation } from "@apollo/client";
import { FC, useState } from "react";
import { BiLoader } from "react-icons/bi";
import Button from "~/components/button";
import { TextInput } from "~/components/input";
import Modal from "~/components/modal";
import createToast from "~/components/toast";
import { Label } from "~/components/ui/label";
import { EndQuizDocument } from "~/generated/generated";

const EndQuizModal: FC<{
  quizName: string;
  quizId: string;
}> = ({ quizName, quizId }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  const [endQuizMutation, { loading: endQuizLoading }] = useMutation(
    EndQuizDocument,
    {
      refetchQueries: ["EventByOrganizer"],
      awaitRefetchQueries: true,
    },
  );

  const endQuiz = async () => {
    const promise = endQuizMutation({
      variables: {
        quizId,
      },
    })
      .then((res) => {
        if (res.data?.endQuiz.__typename === "MutationEndQuizSuccess") {
          setShowModal(false);
        } else {
          throw new Error(res.data?.endQuiz.message ?? "Error ending quiz");
        }
      })
      .catch(async (err) => {
        const error = err instanceof Error ? err : new Error(String(err));
        await createToast(Promise.reject(error), "Failed to create quiz");
      });

    await createToast(promise, "Ending Quiz...");
  };

  const disabled = name !== `${quizName}/${quizId}`;

  return (
    <div>
      <Button
        intent={"danger"}
        className="w-auto rounded-md mt-2"
        onClick={() => setShowModal(true)}
      >
        End Quiz
      </Button>
      <Modal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        size="medium"
        title="End Quiz"
      >
        <div className="p-5 flex flex-col gap-y-4 items-center">
          <Label className="text-yellow-100 lg:text-2xl md:text-xl text-lg font-normal select-none">
            To confirm, type &quot;
            <span className="font-bold">
              {quizName}/{quizId}
            </span>
            &quot; in the box below
          </Label>
          <TextInput
            name="name"
            value={name}
            className="md:w-[70%] w-full p-2 rounded-md lg:text-2xl md:text-xl text-lg ring-2 ring-red-500 bg-gray-700"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />
          <Button
            intent={"danger"}
            className="w-fit justify-self-center rounded-md mt-2"
            onClick={endQuiz}
            disabled={disabled}
          >
            {endQuizLoading ? (
              <BiLoader size={20} className="animate-spin h-6 w-6" />
            ) : (
              "End Quiz"
            )}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default EndQuizModal;
