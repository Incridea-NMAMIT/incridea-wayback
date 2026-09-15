import { useMutation } from "@apollo/client";
import { type FC, useState } from "react";
import { IoAdd } from "react-icons/io5";

import Button from "~/components/button";
import Modal from "~/components/modal";
import createToast from "~/components/toast";
import {
  CreateHotelDocument,
  GetAllHotelsDocument,
} from "~/generated/generated";

const AddHotelModal: FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [hotelDescription, setHotelDescription] = useState("");
  const [price, setPrice] = useState(0);

  const [addHotel] = useMutation(CreateHotelDocument, {
    refetchQueries: [GetAllHotelsDocument],
    awaitRefetchQueries: true,
  });

  async function handleHotelModel() {
    const promise = addHotel({
      variables: {
        name: name,
        details: hotelDescription,
        price: price,
      },
    }).then((res) => {
      if (res?.data?.createHotel.__typename !== "MutationCreateHotelSuccess")
        return Promise.reject(new Error("Error could not add hotel"));
    });
    await createToast(promise, "Adding Hotel...");
    setName("");
    setHotelDescription("");
    setPrice(0);
    setShowModal(false);
  }

  return (
    <>
      <div className="flex items-end justify-end">
        <div className="mt-4 flex w-full">
          <Button
            intent="success"
            className="m-3 mb-5 w-full justify-center"
            fullWidth={true}
            disabled={false}
            onClick={() => setShowModal(true)}
          >
            <IoAdd /> Add Hotel
          </Button>
        </div>
        <Modal
          showModal={showModal}
          onClose={() => setShowModal(false)}
          size="medium"
          title="Add Hotel"
        >
          <div className="m-3 flex w-full flex-col items-start">
            <div className="m-3 flex w-full flex-col items-start">
              <p className="m-2">Name</p>
              <input
                type="text"
                id="name"
                className="block w-11/12 rounded-lg border border-gray-600 bg-gray-600 p-2.5 text-sm text-white placeholder-gray-400 ring-gray-500 focus:outline-none focus:ring-2"
                placeholder="Hotel Name..."
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
                required
              />
            </div>
            <div className="m-3 flex w-full flex-col items-start">
              <p className="m-2">Hotel Description</p>
              <textarea
                id="collegeDescription"
                className="block w-11/12 rounded-lg border border-gray-600 bg-gray-600 p-2.5 py-10 text-sm text-white placeholder-gray-400 ring-gray-500 focus:outline-none focus:ring-2"
                placeholder="Hotel Description..."
                onChange={(e) => {
                  setHotelDescription(e.target.value);
                }}
                value={hotelDescription}
              />
            </div>
            <div className="m-3 flex w-full flex-col items-start">
              <p className="m-2">Price</p>
              <input
                type="number"
                id="price"
                className="block w-11/12 rounded-lg border border-gray-600 bg-gray-600 p-2.5 text-sm text-white placeholder-gray-400 ring-gray-500 focus:outline-none focus:ring-2"
                placeholder="Hotel Name..."
                onChange={(e) => {
                  setPrice(Number(e.target.value));
                }}
                value={price}
                required
              />
            </div>
          </div>
          <div className="m-3 flex items-center justify-center">
            <Button
              intent="success"
              size="large"
              className="flex items-center gap-1 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleHotelModel}
            >
              Create
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default AddHotelModal;
