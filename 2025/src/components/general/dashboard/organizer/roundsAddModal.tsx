import { useMutation } from "@apollo/client";
import { Dialog, Transition } from "@headlessui/react";
import { type FC, Fragment, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BiLoaderAlt } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

import Button from "~/components/button";
import createToast from "~/components/toast";
import { CONSTANT } from "~/constants";
import { CreateRoundDocument } from "~/generated/generated";

const RoundAddModal: FC<{
  eventID: string;
  roundNo: number;
  published: boolean;
}> = ({ eventID, roundNo, published }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dateTime, setDateTime] = useState(
    new Date(CONSTANT.DATE.ROUND.DEAFULT_START),
  );
  const [createRound, { loading }] = useMutation(CreateRoundDocument, {
    refetchQueries: ["EventByOrganizer"],
    variables: {
      eventId: eventID,
      date: dateTime,
    },
    awaitRefetchQueries: true, // waits for changes to be reflected, better UX(?) but slower
  });

  const closeModal = () => {
    setIsOpen(false);
    setDateTime(new Date(CONSTANT.DATE.ROUND.DEAFULT_START));
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleCreateRound = async () => {
    const promise = createRound();
    await createToast(promise, "Adding round...");
  };

  return (
    <>
      <Button
        disabled={loading || published}
        onClick={openModal}
        intent="success"
      >
        {loading ? (
          <>
            <BiLoaderAlt className="animate-spin text-xl" />
            Adding...{" "}
          </>
        ) : (
          <>
            <AiOutlinePlus className="text-xl" /> Add
          </>
        )}
      </Button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="backrop-blur-sm absolute left-0 top-0 z-20 flex h-screen w-screen items-center justify-center"
          onClose={closeModal}
        >
          <div className="inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center text-center">
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gray-700/70 text-left align-middle text-gray-100 shadow-xl backdrop-blur-xl transition-all">
                <Dialog.Title
                  as="div"
                  className="flex items-center justify-between p-5 md:p-6"
                >
                  <h3 className="text-lg font-medium leading-6 text-white">
                    Select Date for Round {roundNo + 1}
                  </h3>
                  <button
                    className="text-gray-400 transition-colors hover:text-white"
                    onClick={closeModal}
                  >
                    <IoClose size="1.4rem" />
                  </button>
                </Dialog.Title>
                {/* dateTime  picker */}
                <div className="flex flex-col items-center justify-center p-10">
                  <input
                    type="datetime-local"
                    className="w-full rounded-md bg-gray-800/70 p-2 text-gray-100"
                    value={toISOStringWithTimezone(dateTime).slice(0, 16)}
                    onChange={(e) => {
                      setDateTime(new Date(e.target.value));
                    }}
                  />
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Button
                    disabled={loading}
                    onClick={handleCreateRound}
                    intent="info"
                    className="w-full"
                  >
                    Add Round
                  </Button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default RoundAddModal;

export const toISOStringWithTimezone = (date: Date) => {
  const tzOffset = -date.getTimezoneOffset();
  const diff = tzOffset >= 0 ? "+" : "-";
  const pad = (n: number) => `${Math.floor(Math.abs(n))}`.padStart(2, "0");
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    diff +
    pad(tzOffset / 60) +
    pad(tzOffset % 60)
  );
};
