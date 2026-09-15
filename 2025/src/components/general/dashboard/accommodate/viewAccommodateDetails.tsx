import { useQuery } from "@apollo/client";
import Image from "next/image";
import React from "react";
import { type FC, useState } from "react";
import { IoEye } from "react-icons/io5";

import Button from "~/components/button";
import Modal from "~/components/modal";
import { AccommodationRequestsByUserIdDocument } from "~/generated/generated";

const ViewAccommodateDetails: FC<{
  accId: string;
}> = ({ accId }) => {
  const [showModal, setShowModal] = useState(false);

  const { data: user } = useQuery(AccommodationRequestsByUserIdDocument, {
    variables: {
      userId: accId,
    },
  });

  return (
    <>
      <Button
        intent={"info"}
        className="flex items-center justify-center gap-2"
        size={"medium"}
        onClick={() => setShowModal(true)}
      >
        <IoEye />
        View
      </Button>

      <Modal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        title={"View User Details"}
        size="medium"
      >
        <div className="m-4 flex h-80 items-center justify-center gap-2.5 rounded-t-lg bg-white bg-opacity-20 bg-clip-padding p-1 backdrop-blur-lg backdrop-filter">
          <div className="m-4 flex flex-row items-start justify-center gap-3 text-lg">
            <div className="flex flex-col text-lg font-bold">
              <div>PID</div>
              <div>Name</div>
              <div>Email</div>
              <div>Phone</div>
              <div>Gender</div>
              <div>Hotel</div>
              <div>Room</div>
              <div>CheckIn</div>
              <div>CheckOut</div>
            </div>
            {user?.accommodationRequestsByUserId.__typename ===
              "QueryAccommodationRequestsByUserIdSuccess" && (
                <>
                  <div className="flex flex-col text-lg font-semibold">
                    <div>
                      {user.accommodationRequestsByUserId.data[0]?.user.id}
                    </div>
                    <div>
                      {user.accommodationRequestsByUserId.data[0]?.user.name}
                    </div>
                    <div>
                      {user.accommodationRequestsByUserId.data[0]?.user.email}
                    </div>
                    <div>
                      {
                        user.accommodationRequestsByUserId.data[0]?.user
                          ?.phoneNumber
                      }
                    </div>
                    <div>
                      {user.accommodationRequestsByUserId.data[0]?.gender}
                    </div>
                    <div>
                      {user.accommodationRequestsByUserId.data[0]?.hotel.name}
                    </div>
                    <div>
                      {user.accommodationRequestsByUserId.data[0]?.room ??
                        "Pending"}
                    </div>
                    <div>
                      {user.accommodationRequestsByUserId.data[0]?.checkIn
                        ? new Date(
                          user.accommodationRequestsByUserId.data[0].checkIn,
                        ).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                        })
                        : "Not Available"}
                    </div>
                    <div>
                      {user.accommodationRequestsByUserId.data[0]?.checkOut
                        ? new Date(
                          user?.accommodationRequestsByUserId.data[0].checkOut,
                        ).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                        })
                        : "Not Available"}
                    </div>
                  </div>
                  <div className="text-center">
                    <Image
                      src={
                        user.accommodationRequestsByUserId.data[0]?.IdCard ?? ""
                      }
                      alt="ID card"
                      width={200}
                      height={200}
                    />
                    <span className="font-bold">
                      ID
                    </span>
                  </div>
                </>
              )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ViewAccommodateDetails;
