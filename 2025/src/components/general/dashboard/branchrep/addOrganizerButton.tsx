import { useMutation } from "@apollo/client";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";

import Button from "~/components/button";
import createToast from "~/components/toast";
import { AddOrganizerDocument } from "~/generated/generated";

type Props = {
  userId: string;
  eventId: string;
};

const AddOrganizerButton = ({ userId, eventId }: Props) => {
  // Add Organizer Mutation
  const [addOrganizerMutation, { loading: addOrganizerLoading }] = useMutation(
    AddOrganizerDocument,
    {
      refetchQueries: ["EventsByBranchRep"],
      awaitRefetchQueries: true,
    },
  );

  const handleAddOrganizer = async (userId: string) => {
    const promise = addOrganizerMutation({
      variables: {
        eventId: eventId,
        userId: userId,
      },
    }).then((res) => {
      if (res.data?.addOrganizer.__typename !== "MutationAddOrganizerSuccess") {
        return Promise.reject(new Error("Error adding organizer"));
      }
    });
    await createToast(promise, "Adding organizer...");
  };

  return (
    <Button
      intent={"secondary"}
      size="small"
      className="flex items-center gap-1 disabled:cursor-not-allowed disabled:opacity-50"
      onClick={async () => await handleAddOrganizer(userId)}
      disabled={addOrganizerLoading}
    >
      Add
      <AiOutlinePlus />
    </Button>
  );
};

export default AddOrganizerButton;
