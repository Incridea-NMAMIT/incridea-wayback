import { useMutation } from "@apollo/client";
import { type FC } from "react";
import { useState } from "react";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";

import Button from "~/components/button";
import Modal from "~/components/modal";
import createToast from "~/components/toast";
import { PublishEventDocument } from "~/generated/generated";

const PublishEventModal: FC<{
  eventId: string;
  eventName: string;
  published: boolean;
}> = ({ eventId, eventName, published }) => {
  //mutation to publish event
  const [publishEvent] = useMutation(PublishEventDocument, {
    refetchQueries: ["Events"],
    awaitRefetchQueries: true,
  });

  async function handlePublishEvent() {
    if (!published) {
      const promise = publishEvent({
        variables: {
          id: eventId,
          published: true,
        },
      }).then((res) => {
        if (
          res.data?.publishEvent.__typename !== "MutationPublishEventSuccess"
        ) {
          return Promise.reject(new Error("Error could not publish event"));
        }
      });
      await createToast(promise, "Publishing Event...");
    } else {
      const promise = publishEvent({
        variables: {
          id: eventId,
          published: false,
        },
      }).then((res) => {
        if (
          res.data?.publishEvent.__typename !== "MutationPublishEventSuccess"
        ) {
          return Promise.reject(new Error("Error could not unpublish event"));
        }
      });
      await createToast(promise, "Unpublishing Event...");
    }
    setShowModal(false);
  }

  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex items-center justify-center text-center">
      <Button
        intent={published ? "danger" : "success"}
        disabled={false}
        onClick={() => {
          setShowModal(true);
        }}
      >
        {published ? (
          <>
            <AiOutlineArrowDown /> Unpublish
          </>
        ) : (
          <>
            <AiOutlineArrowUp /> Publish
          </>
        )}
      </Button>
      {published ? (
        <Modal
          title={`Publish Event ${eventName}`}
          size="medium"
          showModal={showModal}
          onClose={() => setShowModal(false)}
        >
          <div>
            <div className="m-3 flex flex-col gap-2">
              <p className="m-3 text-center text-xl">
                Are you sure you want to unpublish this event?
              </p>
            </div>
            <div className="flex flex-row justify-center text-center">
              <h1 className="m-3 text-center">
                <Button
                  intent="success"
                  className="ml-auto"
                  disabled={false}
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  Cancel
                </Button>
              </h1>
              <h1 className="m-3 text-center">
                <Button
                  intent="danger"
                  className="ml-auto"
                  disabled={false}
                  onClick={handlePublishEvent}
                >
                  Unpublish
                </Button>
              </h1>
            </div>
          </div>
        </Modal>
      ) : (
        <Modal
          title={`Publish Event ${eventName}`}
          size="medium"
          showModal={showModal}
          onClose={() => setShowModal(false)}
        >
          <div className="m-3 flex flex-col gap-2">
            <p className="m-3 text-center text-xl">
              Are you sure you want to publish this event?
            </p>
            <div className="flex flex-row justify-center gap-2">
              <h1 className="m-3 text-center">
                <Button
                  intent="danger"
                  className="ml-auto"
                  disabled={false}
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  Cancel
                </Button>
              </h1>
              <h1 className="m-3 text-center">
                <Button
                  intent="success"
                  className="ml-auto"
                  disabled={false}
                  onClick={handlePublishEvent}
                >
                  Publish
                </Button>
              </h1>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PublishEventModal;
