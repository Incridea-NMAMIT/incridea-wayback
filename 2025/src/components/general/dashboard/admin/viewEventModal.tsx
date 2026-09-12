import Link from "next/link";
import { type FC, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import {
  IoCashOutline,
  IoCreateOutline,
  IoInformationOutline,
  IoLocationOutline,
  IoPeopleOutline,
  IoPersonOutline,
} from "react-icons/io5";

import Button from "~/components/button";
import styles from "~/components/general/event/eventDetails.module.css";
import Modal from "~/components/modal";
import { type EventsQuery } from "~/generated/generated";
import "react-quill/dist/quill.bubble.css";
import EditEventModal from "./editEvent";
import TeamModal from "./teamModal";
import dynamic from "next/dynamic";
import { env } from "~/env";


// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});


const VieweventModal: FC<{
  Event: EventsQuery["events"]["edges"][0];
}> = (Event) => {
  const event = Event?.Event?.node;

  const [showModal, setShowModal] = useState(false);

  const getEventAttributes = () => {
    let teamSizeText = "";

    if (event?.minTeamSize === event?.maxTeamSize) {
      teamSizeText += event?.minTeamSize;
      if (event?.minTeamSize === 1) {
        teamSizeText += " member";
      } else teamSizeText += " members";
    } else {
      teamSizeText = `${event?.minTeamSize} - ${event?.maxTeamSize} members`;
    }
    return [
      {
        name: "Venue",
        text: event?.venue,
        Icon: IoLocationOutline,
      },
      {
        name: "Event Type",
        text: event?.eventType,
        Icon: IoPersonOutline,
      },
      {
        name: "Fees",
        text: event?.id==="50" ? 60 : event?.id ==="52" ? 500: event?.id==="53" ? 250 : event?.id==="54" ? 200 : event?.id==="55" ? 150 : event?.id==="56" ? 300 : event?.fees,
        Icon: IoCashOutline,
      },
      {
        name: "Team Size",
        text: teamSizeText,
        Icon: IoPeopleOutline,
      },
      {
        name: "Maximum Teams",
        text: event?.maxTeams,
        Icon: IoInformationOutline,
      },
    ];
  };

  function handleCloseModal() {
    setShowModal(false);
  }

  return (
    <>
      <Button onClick={() => setShowModal(true)} intent="secondary">
        <AiOutlineEye /> View
      </Button>

      <Modal
        title="Event Details"
        showModal={showModal}
        size="medium"
        onClose={handleCloseModal}
      >
        <div className="p-5 md:p-6">
          <div
            className={`${event.image ? "h-64" : "h-40 bg-gray-800/25"
              } relative mb-3 flex w-full items-end overflow-hidden rounded-lg bg-cover bg-center`}
            style={{
              backgroundImage: event.image ? `url(${event.image})` : "none",
            }}
          >
            {!event.image && (
              <span className="absolute right-1/2 top-1/3 translate-x-1/2 text-2xl italic text-white/25">
                no image added
              </span>
            )}
            <span className="w-full bg-gradient-to-b from-transparent to-black/70 p-5 pt-10 text-3xl font-bold">
              {event?.name}
            </span>
            <Link href={`/event/preview/${event.id}`} className="p-5">
              <Button intent={"secondary"}>Preview</Button>
            </Link>
          </div>
          <div className="mb-3 flex flex-row gap-2">
            {Event && <EditEventModal Event={Event.Event} />}
            {Event && <TeamModal Team={Event.Event} />}
          </div>
          <div className="flex flex-wrap gap-2.5">
            {getEventAttributes().map((attr) =>
              attr.text ? (
                <div
                  key={attr.name}
                  className="flex shrink-0 grow items-center gap-2 rounded-lg bg-gray-600 px-3 py-2"
                >
                  {<attr.Icon />}
                  <p>
                    <span className="font-semibold">{attr.name}: </span>
                    {attr.text}
                  </p>
                </div>
              ) : (
                <></>
              ),
            )}
          </div>
          <div className="mt-2.5 rounded-lg bg-gray-600 p-3">
            <div className="mb-3 flex items-center gap-2">
              <IoCreateOutline />
              <p className="font-semibold">Description</p>
            </div>
            <hr className="-mx-3 mb-3 opacity-30" />
            {event?.description ? (
              <ReactQuill
                value={event.description}
                readOnly={true}
                theme="bubble"
                className={`${styles.markup} event-description w-full`}
              />
            ) : (
              <p className="italic text-gray-400">No description added</p>
            )}
          </div>
        </div>

        <div className="flex w-full justify-end gap-2 p-5 pt-0">
          <Button
            className="rounded-lg"
            type="button"
            intent={"danger"}
            onClick={handleCloseModal}
          >
            Close
          </Button>
        </div>
      </Modal >
    </>
  );
};

export default VieweventModal;
