import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlineTeam } from "react-icons/ai";

import Button from "~/components/button";
import Modal from "~/components/modal";
import createToast from "~/components/toast";
import { CONSTANT } from "~/constants";
import { JoinTeamDocument } from "~/generated/generated";
import { teamIdToId } from "~/utils/id";

const JoinTeamModal = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [joinTeam, { loading }] = useMutation(JoinTeamDocument, {
    refetchQueries: ["MyTeam"],
  });
  const handleJoinTeam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const promise = joinTeam({
      variables: {
        teamId: teamIdToId(teamId),
      },
    }).then((res) => {
      if (res.data?.joinTeam.__typename === "Error") {
        setError(res.data.joinTeam.message);
      } else {
        setError("");
        setOpen(false);
      }
    });
    await createToast(promise, "Joining Team");
  };
  const [teamId, setTeamId] = useState("");
  const router = useRouter();
  const { jointeam } = router.query;

  useEffect(() => {
    if (jointeam) {
      setTeamId(jointeam as string);
      setOpen(true);
    }
  }, [jointeam]);

  return (
    <>
      <Button
        className="w-full !skew-x-0 items-center !justify-center rounded-full !tracking-normal"
        disabled={loading}
        onClick={() => setOpen(true)}
        intent={"ghost"}
      >
        <AiOutlineTeam />
        Join Team
      </Button>
      <Modal
        onClose={() => setOpen(false)}
        showModal={open}
        size="small"
        title="Join Team"
        rounded="md"
      >
        <form
          onSubmit={handleJoinTeam}
          className="flex w-full flex-col gap-3 px-5 pb-5 md:px-6 md:pb-6"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="teamName" className="font-semibod text-gray-300">
              Team ID
            </label>
            <input
              type="text"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              name="teamName"
              id="teamName"
              placeholder={`${CONSTANT.TID_FORMAT}00000`}
              required
              className="w-full rounded-full bg-primary-600 px-2 py-1 ring-primary-200/40 focus:outline-none focus:ring"
            />
          </div>
          <Button
            className="w-full !skew-x-0 items-center !justify-center rounded-full !tracking-normal"
            disabled={loading}
            type="submit"
            intent="success"
          >
            Join Team
          </Button>
          {error && (
            <p className="rounded-sm bg-red-200 px-3 py-1 font-semibold text-red-800">
              {error}
            </p>
          )}
        </form>
      </Modal>
    </>
  );
};

export default JoinTeamModal;
