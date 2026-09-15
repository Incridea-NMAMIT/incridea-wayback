import { type FC, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";

import Button from "~/components/button";
import Modal from "~/components/modal";
import { type EventsQuery } from "~/generated/generated";

const VieweventModal: FC<{
  members: EventsQuery["events"]["edges"][number]["node"]["teams"][number]["members"];
}> = ({ members }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)} intent="secondary">
        <AiOutlineEye />
        View
      </Button>
      <Modal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        title={`Members`}
      >
        <div className="m-3 flex flex-col justify-center">
          <div className="mb-2 hidden flex-row justify-center rounded-lg bg-gray-600 p-2 md:flex">
            <span className="flex basis-1/4 justify-center text-center text-lg font-bold">
              PID
            </span>
            <span className="flex basis-1/4 justify-center text-center text-lg font-bold">
              Name
            </span>
            <span className="flex basis-1/4 justify-center text-center text-lg font-bold">
              Email
            </span>
            <span className="flex basis-1/4 justify-center text-center text-lg font-bold">
              Role
            </span>
          </div>
          <div className="h-96 overflow-y-auto md:h-64 md:max-h-72">
            {members?.map((member) => (
              <div
                key={member.user.id}
                className="mb-2 flex flex-col justify-start rounded-lg border border-gray-600 p-2 text-base md:flex-row md:justify-center md:text-lg"
              >
                <span className="mb-2 w-full justify-center text-center font-bold md:mb-0 md:w-1/4 md:text-base">
                  {member.user.id}
                </span>
                <span className="mb-2 w-full justify-center text-center font-bold md:mb-0 md:w-1/4 md:text-base">
                  {member.user.name}
                </span>
                <span
                  className="mb-2 w-full justify-center text-center font-bold md:mb-0 md:w-1/4 md:text-base"
                  style={{ wordBreak: "break-all" }}
                >
                  {member.user.email}
                </span>
                <span className="mb-2 w-full justify-center text-center font-bold md:mb-0 md:w-1/4 md:text-base">
                  {member.user.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default VieweventModal;
