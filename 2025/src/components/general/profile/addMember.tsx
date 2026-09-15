import Link from "next/link";
import { type FC, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineCopy, AiOutlineUserAdd } from "react-icons/ai";
import { BsWhatsapp } from "react-icons/bs";

import Button from "~/components/button";
import Modal from "~/components/modal";
import { CONSTANT } from "~/constants";
import {
  type RegisterdEventsQuery,
} from "~/generated/generated";
import { idToTeamId } from "~/utils/id";
import { generateEventUrl } from "~/utils/url";

const AddMemberModal: FC<{
  team: Extract<
    RegisterdEventsQuery["registeredEvents"],
    { __typename: "QueryRegisteredEventsSuccess" }
  >["data"][number]["teams"][number];
}> = ({ team }) => {
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const url = `Join my team for ${team.event.name
    } event at Incridea ${CONSTANT.YEAR}! Here's the link: ${CONSTANT.BASE_URL}${generateEventUrl(
      team.event.name,
      team.event.id,
    )}?jointeam=${idToTeamId(team.id)}`;

  const copyUrl = async () => {
    await navigator.clipboard.writeText(url);
    toast.success("Copied to clipboard!", {
      position: "bottom-center",
    });
  };

  return (
    <>
      <Button
        onClick={() => {
          setShowModal(true);
        }}
        className="mt-5 !skew-x-0 justify-center rounded-full !tracking-normal"
      >
        <AiOutlineUserAdd size={20} /> Add More
      </Button>
      <Modal
        title={`There's still room for ${team.event.maxTeamSize - team.members.length
          } more crewmates!`}
        showModal={showModal}
        onClose={handleCloseModal}
        size={"small"}
      >
        <div className="flex flex-col justify-center p-5 text-center">
          <p className="text-xs">
            Share this link with your friends to add them to your team!
          </p>
          <div className="mt-2 flex items-center justify-evenly">
            <input
              type="url"
              className="rounded-lg bg-white bg-opacity-20 p-2 text-sm"
              value={url}
            />
            <AiOutlineCopy
              onClick={copyUrl}
              size={20}
              className="cursor-pointer hover:text-gray-400"
            />
          </div>

          <div className="flex items-center py-2">
            <div className="h-px flex-grow bg-gray-600"></div>
            <span className="flex-shrink px-4 text-sm font-light italic">
              or
            </span>
            <div className="h-px flex-grow bg-gray-600"></div>
          </div>

          <Link
            href={`https://wa.me/?text=${encodeURIComponent(url)}`}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-500 p-2 text-sm text-white hover:bg-green-600"
          >
            <BsWhatsapp /> Share on WhatsApp
          </Link>
        </div>
      </Modal>
    </>
  );
};

export default AddMemberModal;
