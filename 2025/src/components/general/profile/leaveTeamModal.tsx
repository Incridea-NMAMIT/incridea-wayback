import { useMutation, useQuery } from "@apollo/client";
import React, { type FC, useState } from "react";
import { toast } from "sonner";
import { FaSignOutAlt } from "react-icons/fa";

import { Button } from "~/components/button/button";
import {
  LeaveTeamDocument,
  RegisterdEventsDocument,
} from "~/generated/generated";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "~/components/modal/modal";

const LeaveTeamModal: FC<{
  refetch: string;
  teamId: string;
}> = ({ teamId, refetch }) => {
  const [showModal, setShowModal] = useState(false);
  const userEvents = useQuery(RegisterdEventsDocument);

  const [leaveTeam, { loading }] = useMutation(LeaveTeamDocument, {
    refetchQueries: [refetch],
    awaitRefetchQueries: true,
  });

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLeave = async (teamId: string) => {
    setShowModal(false);
    const loadingToast = toast.loading("Leaving team...");

    await leaveTeam({
      variables: {
        teamId,
      },
    }).then((res) => {
      if (res.data?.leaveTeam.__typename === "MutationLeaveTeamSuccess") {
        toast.success("You've left the team!");
        toast.dismiss(loadingToast);
        void userEvents.refetch();
      } else {
        toast.error(res.data?.leaveTeam.message ?? "An error occurred");
        toast.dismiss(loadingToast);
      }
    });
  };

  return (
    <>
      <Button
        variant={"destructive"}
        onClick={() => {
          setShowModal(true);
        }}
      >
        <FaSignOutAlt />
      </Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              You will opt out from participating in the Event. This cannot be
              undone
            </DialogDescription>
          </DialogHeader>
          <div className="w-full flex flex-row flex-nowrap justify-center gap-4">
            <DialogClose asChild>
              <Button variant={"destructive"}>Cancel</Button>
            </DialogClose>
            <Button
              variant={"default"}
              onClick={async () => {
                await handleLeave(teamId);
              }}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeaveTeamModal;
