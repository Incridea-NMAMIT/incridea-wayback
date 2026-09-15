import { useMutation } from "@apollo/client";
import { type FC } from "react";
import { toast } from "react-hot-toast";

import Button from "~/components/button";
import {
  OrganizerMarkAttendanceDocument,
  OrganizerMarkAttendanceSoloDocument,
} from "~/generated/generated";
import { pidToId, teamIdToId } from "~/utils/id";

const MarkAttendance: FC<{
  result: string;
  eventType: string;
  eventId?: string;
}> = ({ result, eventType, eventId }) => {
  const [markAttendanceTeam, { loading: TeamAttendanceLoading }] = useMutation(
    OrganizerMarkAttendanceDocument,
    {
      refetchQueries: ["TeamsByRound"],
      awaitRefetchQueries: true,
    },
  );

  const [markAttendanceSolo, { loading: SoloAttendanceLoading }] = useMutation(
    OrganizerMarkAttendanceSoloDocument,
    {
      refetchQueries: ["TeamsByRound"],
      awaitRefetchQueries: true,
    },
  );

  const handleMarkAttendance = async () => {
    if (
      eventType === "INDIVIDUAL" ||
      eventType === "INDIVIDUAL_MULTIPLE_ENTRY"
    ) {
      await markAttendanceSolo({
        variables: {
          userId: pidToId(result),
          eventId: eventId ?? "",
          attended: true,
        },
      }).then((res) => {
        if (res.data?.organizerMarkAttendanceSolo.__typename === "Error") {
          toast.error("Error marking attendance");
        } else if (
          res.data?.organizerMarkAttendanceSolo.__typename ===
          "MutationOrganizerMarkAttendanceSoloSuccess"
        ) {
          toast.success("Marked attendance", {
            position: "bottom-center",
          });
        }
      });
    } else if (eventType === "TEAM" || eventType === "TEAM_MULTIPLE_ENTRY") {
      await markAttendanceTeam({
        variables: {
          teamId: teamIdToId(result),
          attended: true,
        },
      }).then((res) => {
        // Custom toasts when teamId is not found, because backend mutation doesn't check if it exists
        // hence createToast will still present it as a success as promise is resolved
        if (res.data?.organizerMarkAttendance.__typename === "Error") {
          toast.error("Error marking attendance");
        } else if (
          res.data?.organizerMarkAttendance.__typename ===
          "MutationOrganizerMarkAttendanceSuccess"
        ) {
          toast.success("Marked attendance", {
            position: "bottom-center",
          });
        }
      });
    }
  };

  return (
    <div>
      <Button
        onClick={handleMarkAttendance}
        disabled={TeamAttendanceLoading || SoloAttendanceLoading}
        intent={"primary"}
        className="mt-2"
      >
        Mark Present
      </Button>
    </div>
  );
};

export default MarkAttendance;
