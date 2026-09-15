import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

import createToast from "~/components/toast";
import { AddCommentDocument, GetCommentDocument } from "~/generated/generated";
import { idToTeamId } from "~/utils/id";

const Remarks = ({
  eventId,
  roundNo,
  teamId,
}: {
  eventId: string;
  roundNo: number;
  teamId: string;
}) => {
  const { data, loading } = useQuery(GetCommentDocument, {
    variables: {
      eventId,
      roundNo,
      teamId,
    },
    skip: !eventId || !roundNo || !teamId,
  });

  const [addRemark, { data: addRemarkData }] = useMutation(AddCommentDocument, {
    refetchQueries: ["GetComment"],
    awaitRefetchQueries: true,
  });

  const [remarks, setRemarks] = useState<string>("");

  useEffect(() => {
    if (data?.getComment?.__typename === "QueryGetCommentSuccess") {
      setRemarks(data.getComment.data.comment);
    }
  }, [data?.getComment]);

  const handleUpdate = async () => {
    if (data?.getComment.__typename === "QueryGetCommentSuccess") {
      if (data.getComment.data.comment === remarks) {
        return;
      }
    }
    if (remarks) {
      const promise = addRemark({
        variables: {
          eventId: Number(eventId),
          roundNo,
          teamId: Number(teamId),
          comment: remarks,
        },
      });
      await createToast(promise, "Adding remarks...");
      if (
        addRemarkData?.addComment.__typename === "MutationAddCommentSuccess"
      ) {
        setRemarks("");
      }
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    if (loading) return;

    // Clear previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout
    timeoutId = setTimeout(() => void handleUpdate(), 500);

    // Cleanup function to clear the timeout
    return () => {
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remarks]);

  return (
    <div className="relative mt-2 p-3 pt-0">
      <h1 className="my-2 text-start font-bold text-white/90">
        Additional Remarks for {idToTeamId(teamId)}
      </h1>
      <textarea
        rows={4}
        className="mb-3 w-full resize-none rounded-md bg-white/10 px-3 py-2 placeholder:text-white/60"
        placeholder={loading ? "Loading..." : "Additional remarks (optional)"}
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
      />
    </div>
  );
};

export default Remarks;
