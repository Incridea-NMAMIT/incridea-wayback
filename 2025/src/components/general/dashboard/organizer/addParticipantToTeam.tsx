import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { MdOutlineDeleteOutline, MdOutlineQrCodeScanner } from "react-icons/md";

import Button from "~/components/button";
import Modal from "~/components/modal";
import Spinner from "~/components/spinner";
import createToast from "~/components/toast";
import {
  OrganizerAddTeamMemberDocument,
  OrganizerDeleteTeamMemberDocument,
  TeamDetailsDocument,
} from "~/generated/generated";
import { idToPid, pidToId } from "~/utils/id";

import { QRCodeScanner } from "./qRCodeScanner";
import { CONSTANT } from "~/constants";

export default function AddParticipantToTeam({
  isOpen,
  setIsOpen,
  teamId,
  teamName,
}: {
  teamId: string;
  isOpen: boolean;
  teamName: string;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [organizerAddParticipantToTeam] = useMutation(
    OrganizerAddTeamMemberDocument,
    {
      refetchQueries: ["TeamDetails"],
    },
  );
  const { data: teamData } = useQuery(TeamDetailsDocument, {
    variables: {
      id: teamId,
    },
  });
  const [organizerDeleteTeamMember] = useMutation(
    OrganizerDeleteTeamMemberDocument,
    {
      refetchQueries: ["TeamDetails"],
    },
  );
  const [userId, setUserId] = useState<string>("");
  const removeHandler = async (userId: string) => {
    const promise = organizerDeleteTeamMember({
      variables: {
        teamId,
        userId,
      },
    }).then((res) => {
      if (
        res.data?.organizerDeleteTeamMember.__typename ===
        "MutationOrganizerDeleteTeamMemberSuccess"
      ) {
        setUserId("");
      } else {
        if (res.errors) {
          throw new Error(res.errors[0]?.message);
        } else {
          throw new Error("Error adding member to team");
        }
      }
    });
    await createToast(promise, "Removing Participant...");
  };
  const addHandler = async () => {
    if (!userId) return;
    const promise = organizerAddParticipantToTeam({
      variables: {
        teamId,
        userId: userId.startsWith(CONSTANT.PID_FORMAT)
          ? pidToId(userId)
          : userId,
      },
    }).then((res) => {
      if (
        res.data?.organizerAddTeamMember.__typename ===
        "MutationOrganizerAddTeamMemberSuccess"
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

  const [scanModalOpen, setScanModalOpen] = useState<boolean>(false);

  return (
    <Modal
      showModal={isOpen}
      onClose={() => setIsOpen(false)}
      title={"Add Participant"}
    >
      <div className="flex flex-wrap gap-10 p-5 md:p-6">
        <div className="w-full space-y-5 md:w-fit">
          <div className="space-y-2">
            {/* scan user */}
            <label
              htmlFor="ParticipantID"
              className="block text-sm font-medium text-gray-300"
            >
              Scan Participant ID
            </label>
            <Button
              intent={"primary"}
              className="w-full"
              outline
              size={"large"}
              onClick={() => setScanModalOpen(true)}
            >
              Scan <MdOutlineQrCodeScanner className="inline-block text-2xl" />
            </Button>
            <Modal
              title="Scan Participant ID"
              showModal={scanModalOpen}
              onClose={() => setScanModalOpen(false)}
            >
              <div className="p-5">
                <QRCodeScanner intent="addToTeam" teamId={teamId} />
              </div>
            </Modal>
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
        <div className="w-full space-y-6 md:w-fit">
          <p>Members of Team {teamName}</p>

          <div>
            {teamData &&
            teamData.teamDetails.__typename === "QueryTeamDetailsSuccess" ? (
              <div className="space-y-2">
                {teamData.teamDetails.data.members.map((member) => (
                  <div
                    key={member.user.id}
                    className="flex items-start justify-between gap-3 rounded-lg bg-white bg-opacity-10 p-2 md:gap-5 md:p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="font-mono text-lg text-green-500">
                        {idToPid(member.user.id)}
                      </div>
                      <div className="flex flex-col">
                        <p className="font-medium text-white">
                          {member.user.name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {member.user.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      intent={"danger"}
                      onClick={async () => await removeHandler(member.user.id)}
                      outline
                      className="text-xl"
                    >
                      <MdOutlineDeleteOutline className="text-2xl" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <Spinner />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
