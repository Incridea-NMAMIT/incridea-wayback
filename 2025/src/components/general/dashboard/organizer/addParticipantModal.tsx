import { useMutation } from "@apollo/client";
import { useState } from "react";

import Button from "~/components/button";
import Modal from "~/components/modal";
import createToast from "~/components/toast";
import { OrganizerRegisterSoloDocument } from "~/generated/generated";
import { pidToId } from "~/utils/id";

import ScanParticipantModal from "./scanParticipantModal";
import { CONSTANT } from "~/constants";

export default function AddParticipantModal({ eventId }: { eventId: string }) {
  const [organizerRegisterSolo] = useMutation(OrganizerRegisterSoloDocument, {
    refetchQueries: ["TeamsByRound"],
  });
  const [userId, setUserId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const addHandler = async () => {
    if (!userId) return;
    const promise = organizerRegisterSolo({
      variables: {
        eventId,
        userId: userId.startsWith(CONSTANT.PID_FORMAT)
          ? pidToId(userId)
          : userId,
      },
    }).then((res) => {
      if (
        res.data?.organizerRegisterSolo.__typename ===
        "MutationOrganizerRegisterSoloSuccess"
      ) {
        setUserId("");
      } else {
        if (res.errors) {
          throw new Error(res.errors[0]!.message);
        } else {
          throw new Error("Error adding member to team");
        }
      }
    });
    await createToast(promise, "Adding Participant...");
  };

  return (
    <>
      <Button
        intent={"ghost"}
        outline
        size={"large"}
        className="w-full whitespace-nowrap rounded-lg md:w-fit"
        onClick={() => setIsOpen(true)}
      >
        Add Participant
      </Button>

      <Modal
        showModal={isOpen}
        onClose={() => setIsOpen(false)}
        title={"Add Participant"}
      >
        <div className="mx-auto w-full space-y-5 p-5 md:w-fit md:p-6">
          <div className="space-y-2">
            {/* scan user */}
            <label
              htmlFor="ParticipantID"
              className="block text-sm font-medium text-gray-300"
            >
              Scan Participant ID
            </label>
            <ScanParticipantModal eventId={eventId} />
          </div>
          <div className="w-full text-center">OR</div>
          <div className="space-y-2">
            <label
              htmlFor="ParticipantID"
              className="block text-sm font-medium text-gray-300"
            >
              Enter Participant ID
            </label>
            <input
              type="text"
              className="block w-full rounded-lg border border-gray-600 bg-gray-600 p-2.5 text-white placeholder-gray-400 ring-gray-500 focus:outline-none focus:ring-2"
              placeholder={`${CONSTANT.PID_FORMAT}0000`}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          <Button
            intent={"info"}
            outline
            size={"large"}
            onClick={addHandler}
            className="w-full whitespace-nowrap rounded-lg"
          >
            Add Participant
          </Button>
        </div>
      </Modal>
    </>
  );
}
