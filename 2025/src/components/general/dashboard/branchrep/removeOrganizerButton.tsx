import { useMutation } from "@apollo/client";
import { type FC } from "react";
import { BiTrash } from "react-icons/bi";

import Button from "~/components/button";
import createToast from "~/components/toast";
import { RemoveOrganizerDocument } from "~/generated/generated";

const RemoveOrganizer: FC<{
  organizerId: string;
  eventId: string;
}> = ({ organizerId, eventId }) => {
  // Remove Organizer Mutation
  const [removeOrganizerMutation, { loading: removeOrganizerLoading }] =
    useMutation(RemoveOrganizerDocument, {
      refetchQueries: ["EventsByBranchRep"],
      awaitRefetchQueries: true,
    });

  // Remove Organizer Handler
  const handleRemoveOrganizer = async () => {
    const promise = removeOrganizerMutation({
      variables: {
        eventId: eventId,
        userId: organizerId,
      },
    }).then((res) => {
      if (
        res.data?.removeOrganizer.__typename !==
        "MutationRemoveOrganizerSuccess"
      ) {
        return Promise.reject(new Error("Error removing organizer"));
      }
    });
    await createToast(promise, "Removing organizer...");
  };

  return (
    <Button
      intent={"danger"}
      size="small"
      outline
      className="mr-1 px-1"
      onClick={handleRemoveOrganizer}
      disabled={removeOrganizerLoading}
    >
      <BiTrash />
    </Button>
  );
};

export default RemoveOrganizer;
