import { useQuery } from "@apollo/client";
import { useState } from "react";
import Spinner from "~/components/spinner";
import { GetEventStatusDocument } from "~/generated/generated";
import { Search, X } from "lucide-react";

export default function EventStatusCard() {
  const { data, loading, error } = useQuery(GetEventStatusDocument);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );
  }

  const eventStatuses =
    data?.getEventStatus.__typename === "QueryGetEventStatusSuccess"
      ? data.getEventStatus.data
      : [];

  const filteredEvents = eventStatuses.filter((event) =>
    event.eventName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusColor = (status: string) => {
    if (status.includes("ONGOING")) return "text-yellow-500";
    if (status.includes("YET TO START") && status.includes("DONE")) return "text-orange-500";
    if (status.includes("COMPLETED") || status.includes("DONE")) return "text-green-500";
    if (status.includes("YET TO START")) return "text-red-400";
    return "text-red-200";
  };

  const handleSearchClose = () => {
    setIsSearchVisible(false);
    setSearchTerm("");
  };

  return (
    <div className="rounded-xl bg-white/10 backdrop-blur-lg shadow-lg overflow-hidden w-full h-full">
      <div className="px-6 py-4 border-b border-white/20">
        <div className="flex items-center justify-between">
          {!isSearchVisible ? (
            <>
              <h2 className="text-2xl font-bold text-white py-1">
                Event Status
              </h2>
              <button
                onClick={() => setIsSearchVisible(true)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Search className="text-white h-5 w-5" />
              </button>
            </>
          ) : (
            <div className="w-full relative">
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-12 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <button
                onClick={handleSearchClose}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-white/10"
              >
                <X className="text-gray-400 h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="p-6 overflow-y-auto max-h-80 overflow-x-auto">
        {/* Table Header */}
        <div className="flex border-b border-white/20 py-4">
          <div className="w-3/12 px-4 text-sm font-semibold text-gray-300">
            Sl No
          </div>
          <div className="w-5/12 px-4 text-sm font-semibold text-gray-300">
            Event Name
          </div>
          <div className="w-4/12 px-4 text-sm font-semibold text-gray-300 text-center">
            Status
          </div>
        </div>

        {/* Table Rows */}
        {filteredEvents.map((event, index) => (
          <div
            key={index}
            className="flex border-b border-white/20 hover:bg-white/5 py-3"
          >
            <div className="w-3/12 px-4 text-white">{index + 1}</div>
            <div className="w-5/12 px-4 text-white">{event.eventName}</div>
            <div className="w-4/12 px-4 text-center font-semibold overflow-hidden relative">
              {event.status.split(",").map((part, index) => {
                const trimmedPart = part.trim();
                return (
                  <div key={index} className={`${getStatusColor(trimmedPart)} my-1`}>
                    {trimmedPart}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
