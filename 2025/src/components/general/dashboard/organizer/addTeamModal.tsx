import { useMutation } from "@apollo/client";
import { useState } from "react";

import Button from "~/components/button";
import Modal from "~/components/modal";
import createToast from "~/components/toast";
import { OrganizerCreateTeamDocument } from "~/generated/generated";

import AddParticipantToTeam from "./addParticipantToTeam";

export default function AddTeamModal({ eventId }: { eventId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenParticipantModal, setIsOpenParticipantModal] = useState(false);
  const [organizerCreateTeam, { data, loading }] = useMutation(
    OrganizerCreateTeamDocument,
    {
      refetchQueries: ["TeamDetails"],
    },
  );

  function validateAlphaNumeric(str: string) {
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    return alphanumericRegex.test(str);
  }

  const [teamName, setTeamName] = useState("");

  const createHandler = async () => {
    if (teamName.length !== 0) {
      if (!validateAlphaNumeric(teamName)) {
        await createToast(
          Promise.reject(
            new Error("Team name can only contain alphanumeric characters"),
          ),
          "Team name can only contain alphanumeric characters",
        );
        return;
      }
      const promise = organizerCreateTeam({
        variables: {
          eventId,
          name: teamName,
        },
      })
        .then(async (res) => {
          if (
            res.data?.organizerCreateTeam.__typename ===
            "MutationOrganizerCreateTeamSuccess"
          ) {
            setTeamName("");
            setIsOpen(false);
            setIsOpenParticipantModal(true);
          } else {
            let errorMessage = "Error creating team";
            if (res.data) {
              errorMessage = res.data.organizerCreateTeam.message;
            }
            await createToast(promise, errorMessage);
            return Promise.reject(new Error(errorMessage));
          }
        })
        .catch((error) => {
          throw new Error(
            `Error: ${error instanceof Error ? error.message : error}`,
          );
        });
      await createToast(promise, "Creating Team...");
    } else {
      await createToast(
        Promise.reject(new Error("Team name cannot be empty")),
        "Team name cannot be empty",
      );
    }
  };

  return (
    <>
      <Button
        intent={"info"}
        outline
        size={"large"}
        className="w-full whitespace-nowrap rounded-lg md:w-fit"
        onClick={() => setIsOpen(true)}
      >
        <span className="text-white">Add Team</span>
      </Button>
      <Modal
        showModal={isOpen}
        onClose={() => setIsOpen(false)}
        title={"Add Team"}
      >
        <div className="p-5 md:p-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-white"
            >
              Team Name
            </label>
            <input
              type="text"
              disabled={loading}
              className="rounded-md bg-gray-600 p-2 text-gray-100 disabled:opacity-50"
              placeholder="RCB"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>
          <div>
            <Button
              intent={"info"}
              size={"large"}
              className="mt-4 whitespace-nowrap rounded-lg"
              disabled={loading}
              onClick={createHandler}
            >
              Add Team
            </Button>
          </div>
        </div>
      </Modal>
      {data?.organizerCreateTeam.__typename ===
        "MutationOrganizerCreateTeamSuccess" &&
        isOpenParticipantModal && (
          <AddParticipantToTeam
            isOpen={isOpenParticipantModal}
            teamName={data.organizerCreateTeam.data.name}
            setIsOpen={setIsOpenParticipantModal}
            teamId={data.organizerCreateTeam.data.id}
          />
        )}
    </>
  );
}
