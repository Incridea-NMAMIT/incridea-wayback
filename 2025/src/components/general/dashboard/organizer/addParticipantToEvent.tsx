import { useMutation } from "@apollo/client";
import { type FC } from "react";
import { toast, Toaster } from "react-hot-toast";

import Button from "~/components/button";
import { CONSTANT } from "~/constants";
import { OrganizerRegisterSoloDocument } from "~/generated/generated";
import { pidToId } from "~/utils/id";

const AddParticipantToEvent: FC<{
  userId: string;
  eventId: string;
}> = ({ userId, eventId }) => {
  const [register, { loading }] = useMutation(OrganizerRegisterSoloDocument, {
    refetchQueries: ["TeamsByRound"],
    awaitRefetchQueries: true,
  });

  return (
    <div>
      <Toaster />
      <Button
        onClick={async () => {
          await register({
            variables: {
              eventId,
              userId: userId.startsWith(CONSTANT.PID_FORMAT)
                ? pidToId(userId)
                : userId,
            },
          }).then((res) => {
            if (res.data?.organizerRegisterSolo.__typename === "Error") {
              toast.error("Not a valid PID");
            }
            if (
              res.data?.organizerRegisterSolo.__typename ===
              "MutationOrganizerRegisterSoloSuccess"
            ) {
              toast.success("Registered!", {
                position: "bottom-center",
              });
            }
          });
        }}
        disabled={loading}
        intent={"primary"}
        className="mt-2"
      >
        Add Participant
      </Button>
    </div>
  );
};

export default AddParticipantToEvent;
