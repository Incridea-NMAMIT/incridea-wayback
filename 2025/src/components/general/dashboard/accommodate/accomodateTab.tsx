import { useQuery } from "@apollo/client";
import { type FC } from "react";

import Spinner from "~/components/spinner";
import {
  AccommodationBookingStatus,
  AccommodationRequestsDocument,
} from "~/generated/generated";

import EditAccommodateDetails from "./editAccommodateDetails";
import HotelModal from "./hotelModal";
import ViewAccommodateDetails from "./viewAccommodateDetails";

const AccommodateTab: FC = () => {
  const { data: accommodationRequests, loading: accommodateLoading } = useQuery(
    AccommodationRequestsDocument,
  );

  return (
    <>
      <div>
        {/* Admin Header */}

        <div className="mt-6 flex flex-col gap-1 md:m-3 md:flex-row md:justify-center">
          <div className="mt-5 flex basis-2/3 flex-col justify-between gap-1 md:gap-0.5">
            <div className="m-4 flex items-center justify-between gap-3">
              <h1 className="text-3xl">Accommodation Requests</h1>
              <div className="flex items-center justify-center">
                <HotelModal />
              </div>
            </div>
            <div className="ml-2 hidden h-20 items-center justify-between gap-8 rounded-t-lg bg-white bg-opacity-20 bg-clip-padding p-8 text-lg font-bold backdrop-blur-lg backdrop-filter md:flex">
              <h1 className="basis-1/5 py-2.5 text-start">Name</h1>
              <h1 className="basis-1/5 py-2.5 text-center">Gender</h1>
              <h1 className="basis-1/5 py-2.5 text-center">CheckIn</h1>
              <h1 className="basis-1/5 py-2.5 text-center">CheckOut</h1>
              <h1 className="basis-1/5 py-2.5 pr-2 text-center">Hotel</h1>
              <h1 className="basis-1/5 py-2.5 text-center">Room No.</h1>
              <h1 className="basis-1/5 py-2.5 pr-2 text-center">Status</h1>
              <h1 className="basis-1/5 py-2.5 pr-5 text-center">Action</h1>
              <h1 className="basis-1/5 py-2.5 pr-5 text-center">View</h1>
            </div>
            {accommodateLoading && (
              <div className="mt-10 flex items-center justify-center">
                <Spinner className="text-gray-300" />
              </div>
            )}

            <div className="max-h-80 w-full overflow-y-auto text-center md:h-[300px] md:max-h-80">
              {accommodationRequests?.accommodationRequests?.__typename ==
                "QueryAccommodationRequestsSuccess" ? (
                accommodationRequests.accommodationRequests.data.map(
                  (acc, idx) => (
                    <div
                      key={idx}
                      className={`mb-3 ml-2 flex flex-col items-start rounded-lg bg-white/10 p-3 md:my-0 md:flex-row md:items-center md:justify-center md:rounded-none md:p-4`}
                    >
                      <h1 className="flex basis-1/6 justify-start py-0.5 text-start text-lg">
                        {acc?.user?.name}
                      </h1>
                      <h1 className="flex basis-1/6 justify-center py-0.5 pr-2 text-start text-lg">
                        {acc?.gender}
                      </h1>
                      <h1 className="flex basis-1/6 justify-center py-0.5 text-center text-sm">
                        {acc.checkIn
                          ? new Date(acc.checkIn).toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                          })
                          : "Not Available"}
                      </h1>
                      <h1 className="flex basis-1/6 justify-center py-0.5 text-center text-sm">
                        {acc.checkOut
                          ? new Date(acc.checkOut).toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                          })
                          : "Not Available"}
                      </h1>
                      <h1 className="flex basis-1/6 justify-center py-0.5 text-center text-lg">
                        {acc.hotel.name}
                      </h1>
                      <h1 className="flex basis-1/6 justify-center py-0.5 text-center text-lg">
                        {acc.room}
                      </h1>
                      <h1
                        className={`flex basis-1/6 justify-center py-0.5 text-center text-lg ${acc?.status == AccommodationBookingStatus.Confirmed
                          ? "border-green-500 text-green-500"
                          : "border-red-500 text-red-500"
                          }`}
                      >
                        {acc?.status}
                      </h1>
                      <h1 className="bg-slate flex basis-1/6 justify-center py-0.5 text-center text-lg">
                        <EditAccommodateDetails accommodation={acc} />
                      </h1>
                      <ViewAccommodateDetails accId={acc.user.id} />
                    </div>
                  ),
                )
              ) : (
                <>
                  {accommodationRequests?.accommodationRequests?.__typename ==
                    "Error" ? (
                    <div className="flex items-center justify-center">
                      <h1 className="text-2xl text-gray-300">
                        No Accommodation Requests
                      </h1>
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccommodateTab;
