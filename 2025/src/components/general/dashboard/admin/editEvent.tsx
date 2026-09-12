import { useMutation } from "@apollo/client";
import dynamic from "next/dynamic";
import { type FC } from "react";
import { useState, useEffect } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import "react-quill/dist/quill.snow.css";

import Button from "~/components/button";
import Modal from "~/components/modal";
import ToggleSwitch from "~/components/switch";
import createToast from "~/components/toast";
import { type EventsQuery } from "~/generated/generated";
import { EventType } from "~/generated/generated";
import { UpdateEventDocument } from "~/generated/generated";

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const EditEvent: FC<{
  Event: EventsQuery["events"]["edges"][0];
}> = ({ Event }) => {
  const event = Event?.node;

  const [maxTeams, setMaxTeams] = useState(event?.maxTeams);
  const [name, setName] = useState(event?.name);
  const [eventType, setEventType] = useState(event?.eventType);
  const [maxTeamSize, setMaxTeamSize] = useState(event?.maxTeamSize);
  const [minTeamSize, setMinTeamSize] = useState(event?.minTeamSize);
  const [venue, setVenue] = useState(event?.venue);
  const [fees, setFees] = useState(event?.fees);
  const [showModal, setShowModal] = useState(false);

  const [editorState, setEditorState] = useState<string>("");
  const [updateEvent, { loading }] = useMutation(UpdateEventDocument, {
    refetchQueries: ["Events"],
  });

  async function saveHandler() {
    setShowModal(false);
    const promise = updateEvent({
      variables: {
        id: event?.id,
        maxTeams,
        name,
        maxTeamSize,
        minTeamSize,
        venue,
        fees,
        eventType: eventType as EventType,
        description: editorState,
      },
    }).then((res) => {
      if (res.data?.updateEvent.__typename === "Error") {
        throw new Error(res.data.updateEvent.message);
      }
    });
    await createToast(promise, "Updating event...");
  }

  useEffect(() => {
    const description = event?.description;
    try {
      setEditorState(description ?? "");
    } catch (error) {
      console.log(error);
    }
  }, [event]);

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        intent="secondary"
        disabled={event?.published}
        className={
          event?.published
            ? "pointer-events-none cursor-not-allowed opacity-50"
            : ""
        }
      >
        <AiOutlineEdit />
        Edit
      </Button>
      <Modal
        title="Edit Event Details"
        size="medium"
        showModal={showModal}
        onClose={() => setShowModal(false)}
      >
        <div className="p-5">
          <div className="mt-2">
            <div className="mb-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setEditorState(event.description ?? "")}
                  className="mb-2 block text-sm font-medium text-white bg-[#D79128] bg-opacity-50 p-2.5 rounded-lg"
                >
                  Refresh
                </button>
              </div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-white"
              >
                Event Name
              </label>
              <input
                type="text"
                id="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="block w-full rounded-lg border border-gray-600 bg-gray-600 p-2.5 text-sm text-white placeholder-gray-400 ring-gray-500 focus:outline-none focus:ring-2"
                placeholder="Event Name..."
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-white"
              >
                Event Description
              </label>
              <div className="w-full">
                <ReactQuill
                  theme="snow"
                  value={editorState}
                  onChange={(value) => {
                    setEditorState(value);
                  }}
                  modules={{
                    toolbar: {
                      container: [
                        [{ header: "1" }, { header: "2" }, { font: [] }],
                        [{ size: [] }],
                        ["bold", "italic", "underline", "strike", "blockquote"],
                        [
                          { list: "ordered" },
                          { list: "bullet" },
                          { indent: "-1" },
                          { indent: "+1" },
                        ],
                        ["link", "image", "video"],
                        ["clean"],
                      ],
                    },
                  }}
                  formats={[
                    "header",
                    "font",
                    "size",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "blockquote",
                    "list",
                    "bullet",
                    "indent",
                    "link",
                    "image",
                    "video",
                  ]}
                  style={{ color: "white" }}
                />
              </div>
            </div>
            <div className="mb-6 flex flex-wrap justify-between gap-6">
              <div className="grow basis-full md:basis-1/3">
                <label
                  htmlFor="Venue"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Venue
                </label>
                <input
                  type="text"
                  id="Venue"
                  required
                  onChange={(e) => setVenue(e.target.value)}
                  value={venue ?? ""}
                  className="block w-full rounded-lg border border-gray-600 bg-gray-600 p-2.5 text-sm text-white placeholder-gray-400 ring-gray-500 focus:outline-none focus:ring-2"
                  placeholder="LC01"
                />
              </div>
              <div className="grow basis-full md:basis-1/3">
                <label className="mb-2 block text-sm font-medium text-white">
                  Event Type
                </label>
                <select
                  id="eventType"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as EventType)}
                  className="h-10 w-full rounded-lg border border-gray-600 bg-gray-600 px-4 pr-16 text-sm ring-gray-500 focus:outline-none focus:ring-2"
                >
                  {Object.values(EventType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6 flex flex-wrap justify-between gap-6">
              <div className="grow basis-full md:basis-1/3">
                <label
                  htmlFor="fees"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Entry Fees
                </label>
                <input
                  type="number"
                  id="fees"
                  onChange={(e) => setFees(Number(e.target.value) || 0)}
                  value={fees}
                  className="block w-full rounded-lg border border-gray-600 bg-gray-600 p-2.5 text-sm text-white placeholder-gray-400 ring-gray-500 focus:outline-none focus:ring-2"
                  placeholder="Entry Fees..."
                  defaultValue={event?.fees}
                />
              </div>
              {(eventType === EventType.Team ||
                eventType === EventType.TeamMultipleEntry) && (
                  <div className="grow basis-full md:basis-1/3">
                    <label className="mb-2 block text-sm font-medium text-white">
                      Team Size
                    </label>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        id="minTeamSize"
                        className="block w-full rounded-lg border border-gray-600 bg-gray-600 p-2.5 text-sm text-white placeholder-gray-400 ring-gray-500 focus:outline-none focus:ring-2"
                        placeholder="Min Team Size..."
                        value={minTeamSize}
                        onChange={(e) =>
                          setMinTeamSize(Number(e.target.value) || 0)
                        }
                        min={1}
                      />
                      <span className="text-white">to</span>

                      <input
                        type="number"
                        id="maxTeamSize"
                        className="block w-full rounded-lg border border-gray-600 bg-gray-600 p-2.5 text-sm text-white placeholder-gray-400 ring-gray-500 focus:outline-none focus:ring-2"
                        placeholder="Max Team Size..."
                        min={1}
                        value={maxTeamSize}
                        onChange={(e) =>
                          setMaxTeamSize(Number(e.target.value) || 0)
                        }
                      />
                    </div>
                  </div>
                )}
            </div>

            <div className="mb-6 flex flex-wrap justify-between gap-6">
              <div className="grow basis-full md:basis-1/3" />
              <div className="grow basis-full md:basis-1/3">
                <div className="mb-2 flex items-center gap-2">
                  <label className="block text-sm font-medium text-white">
                    Teams Limit
                  </label>
                  <ToggleSwitch
                    checked={maxTeams !== null}
                    onChange={(checked) => {
                      if (checked) {
                        setMaxTeams(60);
                      } else {
                        setMaxTeams(null);
                      }
                    }}
                  />
                </div>

                {maxTeams !== null ? (
                  <input
                    type="number"
                    id="maxTeams"
                    className="block w-full rounded-lg border border-gray-600 bg-gray-600 p-2.5 text-sm text-white placeholder-gray-400 ring-gray-500 focus:outline-none focus:ring-2"
                    placeholder="Max Teams..."
                    min={1}
                    value={maxTeams}
                    disabled={maxTeams === null}
                    onChange={(e) => {
                      setMaxTeams(parseInt(e.target.value));
                    }}
                  />
                ) : (
                  <div className="block rounded-lg border border-gray-600 bg-gray-600 p-2.5 text-sm text-white placeholder-gray-400 opacity-50 ring-gray-500 focus:outline-none focus:ring-2">
                    No Limit
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex w-full justify-end gap-2">
            <Button
              type="submit"
              intent={"success"}
              onClick={saveHandler}
              disabled={loading}
              className="rounded-lg"
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EditEvent;
