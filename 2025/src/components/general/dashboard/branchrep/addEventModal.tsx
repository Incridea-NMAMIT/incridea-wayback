import { type QueryResult, useMutation } from "@apollo/client";
import { type FC, useState } from "react";
import { IoAdd } from "react-icons/io5";

import Button from "~/components/button";
import { TextInput } from "~/components/input";
import Modal from "~/components/modal";
import createToast from "~/components/toast";
import {
  CreateEventDocument,
  type EventsByBranchRepQuery,
  type EventsByBranchRepQueryVariables,
  EventType,
} from "~/generated/generated";

const AddEventModal: FC<{
  eventsRefetch: QueryResult<
    EventsByBranchRepQuery,
    EventsByBranchRepQueryVariables
  >["refetch"];
}> = ({ eventsRefetch }) => {
  const [showModal, setShowModal] = useState(false);

  function handleCloseModal() {
    setShowModal(false);
  }

  const [createEventMutation, { loading: createEventLoading }] =
    useMutation(CreateEventDocument);

  const handleAddEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleCloseModal();

    const promise = createEventMutation({
      variables: {
        eventType: eventType,
        name: eventName,
      },
    }).then((res) => {
      if (res.data?.createEvent.__typename === "MutationCreateEventSuccess") {
        return eventsRefetch();
      }
    });

    await createToast(promise, "Adding event...");
  };

  //Controlled Inputs
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState<EventType>(EventType.Individual);

  return (
    <div className="flex items-center justify-center">
      <Button
        fullWidth
        intent={"ghost"}
        size={"large"}
        onClick={() => setShowModal(true)}
      >
        <IoAdd /> Add Event
      </Button>
      <Modal
        title="Add Event"
        size="medium"
        onClose={handleCloseModal}
        showModal={showModal}
      >
        <form
          onSubmit={handleAddEvent}
          className={`flex flex-col gap-5 p-4 md:p-6 ${createEventLoading &&
            "pointer-events-none cursor-not-allowed opacity-50"
            }}`}
        >
          <div className="flex items-center gap-3">
            <label className="basis-1/5" htmlFor="eventName">
              Name
            </label>
            <TextInput
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              id="eventName"
              placeholder="Event Name"
              additionalclasses="basis-4/5"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="basis-1/5" htmlFor="eventType">
              Type
            </label>
            <select
              onChange={(e) => {
                setEventType(e.target.value as EventType);
              }}
              value={eventType}
              id="eventType"
              className="h-10 basis-4/5 rounded-lg border-gray-500 bg-gray-600 px-4 pr-16 text-sm ring-gray-500 focus:outline-none focus:ring-2"
            >
              {Object.values(EventType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <Button
            type="submit"
            className="self-end rounded-lg"
            fullWidth={false}
            intent={"info"}
          >
            Add Event
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default AddEventModal;
