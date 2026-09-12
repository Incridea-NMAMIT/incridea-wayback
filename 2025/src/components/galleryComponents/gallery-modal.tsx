import { Dialog, Transition } from "@headlessui/react";
import React, { type FC, Fragment } from "react";
import { IoClose } from "react-icons/io5";

type ModalProps = {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
  showModal: boolean;
};

const Modal: FC<ModalProps> = ({ children, onClose, showModal }) => {
  return (
    <Transition appear show={showModal} as={Fragment}>
      <Dialog as="div" className="relative z-[900]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-lg" />
        </Transition.Child>

        <div className={`fixed inset-0 z-10 h-full w-full overflow-y-auto`}>
          <div className="flex min-h-full items-center justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`h-full w-full transform overflow-hidden rounded-none text-left align-middle text-gray-100 shadow-xl transition-all`}
              >
                <button
                  className="absolute right-2 top-2 z-[50000] text-gray-200 transition-colors hover:text-white"
                  onClick={onClose}
                >
                  <IoClose size="1.4rem" />
                </button>
                <div>{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
