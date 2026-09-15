import { useMutation } from "@apollo/client";
import React from "react";
import { ImCheckmark, ImCross } from "react-icons/im";

import Button from "~/components/button";
import createToast from "~/components/toast";
import { OrganizerMarkAttendanceDocument } from "~/generated/generated";

type Props = {
  teamId: string;
  attended: boolean;
};

const MarkAttendanceButton = ({ teamId, attended }: Props) => {
  const [markAttendance, { loading: AttendanceLoading }] = useMutation(
    OrganizerMarkAttendanceDocument,
    {
      refetchQueries: ["TeamsByRound"],
      awaitRefetchQueries: true,
    },
  );

  const handleMarkAttendance = async () => {
    const promise = markAttendance({
      variables: {
        teamId: teamId,
        attended: !attended,
      },
    }).then((res) => {
      if (res.data?.organizerMarkAttendance.__typename === "Error") {
        throw new Error(res.data.organizerMarkAttendance.message);
      }
    });
    await createToast(promise, "Updating attendance...");
  };

  return (
    <Button
      onClick={handleMarkAttendance}
      disabled={AttendanceLoading}
      intent={attended ? "danger" : "success"}
      className="h-auto w-6 md:w-auto"
    >
      {attended ? <ImCross /> : <ImCheckmark />}
    </Button>
  );
};

export default MarkAttendanceButton;
