import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { type FC, useState } from "react";
import { MdModeEditOutline } from "react-icons/md";

import Button from "~/components/button";
import Modal from "~/components/modal";
import createToast from "~/components/toast";
import {
  AccommodationBookingStatus,
  type AccommodationRequestsQuery,
  GetAllHotelsDocument,
  UpdateAccommodationStatusDocument,
} from "~/generated/generated";


const AddAccommodateDetails: FC<{
  accommodation: Extract<AccommodationRequestsQuery["accommodationRequests"], { __typename: "QueryAccommodationRequestsSuccess" }>["data"][number];
}> = ({ accommodation }) => {
  const [showModal, setShowModal] = useState(false);
  const [hotelDetails, setHotelDetails] = useState(accommodation.hotel.id);
  const [roomNo, setRoomNo] = useState(accommodation.room);
  const [status, setStatus] = useState<AccommodationBookingStatus>(accommodation.status);

  const { data: allHotels } = useQuery(GetAllHotelsDocument);

  useEffect(() => {
    if (
      allHotels?.getAllHotels.__typename === "QueryGetAllHotelsSuccess" &&
      allHotels?.getAllHotels.data[0]?.id
    ) {
      setHotelDetails(allHotels.getAllHotels.data[0].id);
    } else {
      setHotelDetails(""); // Fallback if no valid id exists
    }
  }, [allHotels]);

  const [updateStatus] = useMutation(UpdateAccommodationStatusDocument, {
    refetchQueries: ["AccommodationRequests"]
  });

  const handleUpdate = async () => {
    const promise = updateStatus({
      variables: {
        hotelId: hotelDetails,
        room: roomNo ?? "",
        bookingId: accommodation.id,
        status,
      },
    }).then(async (res) => {
      if (res.data?.updateStatus.__typename !== "MutationUpdateStatusSuccess") {
        if (res.data?.updateStatus.message !== undefined) {
          await createToast(
            Promise.reject(new Error(res.data?.updateStatus.message)),
            res.data?.updateStatus.message,
          );
        }
        return Promise.reject(new Error("Error could update status"));
      }
    });
    await createToast(promise, "Updating Status...");
  };
  return (
    <>
      <Button
        intent={"info"}
        className="flex items-center justify-center gap-2"
        size={"medium"}
        onClick={() => setShowModal(true)}
      >
        <MdModeEditOutline />
        Edit
      </Button>
      <Modal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        title={"Edit Accommodation Details"}
        size="medium"
      >
        <div className="h-50 m-4 flex flex-col items-center justify-evenly gap-2.5 rounded-t-lg bg-white bg-opacity-20 bg-clip-padding p-4 text-base font-bold backdrop-blur-lg backdrop-filter">
          <div className="mt-2 flex w-full flex-col items-start">
            <label className="m-2" htmlFor="hotelName">
              Choose the Hotels
            </label>
            <select
              onChange={(e) => {
                setHotelDetails(e.target.value);
              }}
              value={hotelDetails}
              id="hotelName"
              className="block w-11/12 rounded-lg border border-gray-600 bg-gray-600 p-2.5 text-sm text-white placeholder-gray-400 ring-gray-500 focus:outline-none focus:ring-2"
            >
              {allHotels?.getAllHotels.__typename ===
                "QueryGetAllHotelsSuccess" &&
                allHotels?.getAllHotels.data.map((hot) => (
                  <option key={hot.id} value={hot.id}>
                    {hot.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex w-full flex-col items-start">
            <p className="m-2">Room No.</p>
            <input
              type="text"
              id="name"
              className="block w-11/12 rounded-lg border border-gray-600 bg-gray-600 p-2.5 text-sm text-white placeholder-gray-400 ring-gray-500 focus:outline-none focus:ring-2"
              placeholder="Room No..."
              onChange={(e) => {
                setRoomNo(e.target.value);
              }}
              value={roomNo ?? ""}
              required
            />
          </div>

          <div className="mt-2 flex w-full flex-col items-start">
            <label className="m-2" htmlFor="status">
              Change the Status
            </label>
            <select
              onChange={(e) => {
                setStatus(e.target.value as AccommodationBookingStatus);
              }}
              value={status}
              id="status"
              className="block w-11/12 rounded-lg border border-gray-600 bg-gray-600 p-2.5 text-sm text-white placeholder-gray-400 ring-gray-500 focus:outline-none focus:ring-2"
            >
              {Object.values(AccommodationBookingStatus).map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <Button
              intent={"info"}
              className="mt-4 flex items-center justify-center gap-2"
              size={"medium"}
              onClick={handleUpdate}
            >
              <MdModeEditOutline />
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddAccommodateDetails;
