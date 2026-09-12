import { useQuery } from "@apollo/client";
import { type FC, useState } from "react";
import { IoSchoolSharp } from "react-icons/io5";

import Button from "~/components/button";
import Modal from "~/components/modal";
import Spinner from "~/components/spinner";
import { GetAllHotelsDocument } from "~/generated/generated";

import AddHotelModal from "./addHotelModal";
import DeleteCollege from "./deleteHotel";

const HotelModal: FC = () => {
  const [showModal, setShowModal] = useState(false);

  const { data: hotelData, loading: hotelLoading } =
    useQuery(GetAllHotelsDocument);

  return (
    <>
      <Button
        intent={"info"}
        className="flex items-center justify-center gap-2"
        size={"medium"}
        onClick={() => setShowModal(true)}
      >
        <IoSchoolSharp />
        Hotels
      </Button>
      <Modal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        title={"Hotels"}
        size="medium"
      >
        <div className="ml-2 mr-4 mt-2 flex h-10 items-center justify-between gap-2.5 rounded-t-lg bg-white bg-opacity-20 bg-clip-padding p-1 text-base font-bold backdrop-blur-lg backdrop-filter">
          <h1 className="basis-1/4 py-2.5 pl-2 text-center">ID</h1>
          <h1 className="basis-2/4 py-2.5 text-center">
            Hotel <span className="hidden md:block">Name</span>
          </h1>
          <h1 className="basis-1/4 py-2.5 pr-5 text-center">
            Delete <span className="hidden md:block">Hotel</span>
          </h1>
        </div>
        <div className="mx-2 mt-3 max-h-64 overflow-y-auto md:h-72 md:max-h-72">
          {hotelLoading && <Spinner size={"small"} />}
          {hotelData?.getAllHotels.__typename === "QueryGetAllHotelsSuccess" &&
            hotelData.getAllHotels.data.map((hotel, index) => (
              <div
                key={index}
                className="mb-2 mr-2 flex items-center justify-between rounded-lg border border-gray-500 p-1 px-2 md:p-2"
              >
                <div className="flex w-full flex-row items-center">
                  <h1 className="basis-1/4 pl-5 text-start text-lg md:pl-2 md:text-center md:text-xl">
                    {hotel?.id}
                  </h1>
                  <h1 className="basis-2/4 pr-2 text-center text-lg md:pr-0 md:text-xl">
                    {hotel?.name}
                  </h1>
                  <h1 className="basis-1/4 text-center text-lg md:pr-5 md:text-xl">
                    <DeleteCollege hotelID={hotel?.id} />
                  </h1>
                </div>
              </div>
            ))}
        </div>
        <AddHotelModal />
      </Modal>
    </>
  );
};

export default HotelModal;
