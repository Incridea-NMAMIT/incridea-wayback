import { useQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useAuth } from "~/hooks/useAuth";
import {
  WinnersByEventDocument,
  SendWinnerWhatsAppNotificationDocument,
} from "~/generated/generated";
import { idToTeamId } from "~/utils/id";
import { JURY_AUTHORIZED_IDS } from "~/utils/constants";
import createToast from "~/components/toast";
import Button from "~/components/button";
import { BiLoaderAlt } from "react-icons/bi";

import ViewTeamModal from "./viewTeamModal";

const STORAGE_KEY = "winnerNotificationDetails";

interface NotificationFormData {
  location: string;
  date: string;
  fromTime: string;
  toTime: string;
}

const ViewWinners = ({ eventId }: { eventId: string }) => {
  const { data: winners, loading: winnersLoading } = useQuery(
    WinnersByEventDocument,
    {
      variables: {
        eventId: eventId,
      },
      skip: !eventId,
    }
  );

  const { user } = useAuth();
  const [formData, setFormData] = useState<NotificationFormData>({
    location: "",
    date: "",
    fromTime: "",
    toTime: "",
  });

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as NotificationFormData;

        if (
          typeof parsedData.location === "string" &&
          typeof parsedData.date === "string" &&
          typeof parsedData.fromTime === "string" &&
          typeof parsedData.toTime === "string"
        ) {
          setFormData(parsedData);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const [sendNotification, { loading: notifyLoading }] = useMutation(
    SendWinnerWhatsAppNotificationDocument
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  };

  const handleNotifyWinners = async () => {
    if (!JURY_AUTHORIZED_IDS.includes(Number(user?.id))) {
      await createToast(
        Promise.reject(new Error("Unauthorized")),
        "Sending notifications...",
        "You are not authorized to send notifications"
      );
      return;
    }

    // Format date and time
    const formattedDate = format(new Date(formData.date), "MMMM do, yyyy");
    const formattedFromTime = format(
      new Date(`${formData.date}T${formData.fromTime}`),
      "h:mm a"
    );
    const formattedToTime = format(
      new Date(`${formData.date}T${formData.toTime}`),
      "h:mm a"
    );

    const promise = sendNotification({
      variables: {
        eventId,
        location: formData.location,
        date: formattedDate,
        fromTime: formattedFromTime,
        toTime: formattedToTime,
      },
    }).then((response) => {
      const message = response.data?.sendWinnerWhatsAppNotification;
      if (!message || message.__typename === "Error") {
        throw new Error("Failed to send notifications");
      }
      if (message.data.includes("already sent")) {
        throw new Error(
          "Notifications were already sent for this event winners"
        );
      }
      return message;
    });

    try {
      await createToast(promise, "Sending notifications...");
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      await createToast(
        Promise.reject(error),
        "Sending notifications...",
        error.message
      );
    }
  };

  const isAuthorized = JURY_AUTHORIZED_IDS.includes(Number(user?.id));

  return (
    <div>
      {winnersLoading && <div>Loading...</div>}
      {!winners && <div>No winners yet</div>}
      <>
        <div
          className={`mb-2 flex items-center rounded-lg bg-white/10 p-2 px-5`}
        >
          <div className="flex w-full flex-row gap-5">
            <div className={`basis-1/4 text-white/80`}>Name</div>
            <div className={`basis-1/4 text-white/80`}>ID</div>
            <div className={`basis-1/4 text-white/80`}>Type</div>
            <div className={`basis-1/4 text-white/80`}>View Team</div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {winners?.winnersByEvent.__typename ===
            "QueryWinnersByEventSuccess" &&
            winners?.winnersByEvent.data.map((winner) => {
              return (
                <div
                  key={winner.id}
                  className={`flex items-center rounded-lg bg-white/10 p-2 px-5`}
                >
                  <div className="flex w-full flex-row gap-5">
                    <div className={`basis-1/4 text-white/80`}>
                      {winner.team.name}
                    </div>
                    <div className={`basis-1/4 text-white/80`}>
                      {idToTeamId(winner.team.id)}
                    </div>
                    <div className={`basis-1/4 text-white/80`}>
                      {winner.type}
                    </div>
                    <div className={`basis-1/4 text-white/80`}>
                      <ViewTeamModal
                        teamId={winner.team.id}
                        teamName={winner.team.name}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="mt-4 space-y-6">
          <h3 className="text-xl font-semibold text-white/90 my-6 text-center">
            Notification Details
          </h3>
          <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
            <div className="space-y-2">
              <label className="text-white/80 text-sm">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Sambhram, Ramanujan Block"
                className="w-full bg-white/10 p-3 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-white/80 text-sm">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full bg-white/10 p-3 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 [color-scheme:dark]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-white/80 text-sm">From Time</label>
              <input
                type="time"
                name="fromTime"
                value={formData.fromTime}
                onChange={handleInputChange}
                className="w-full bg-white/10 p-3 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 [color-scheme:dark]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-white/80 text-sm">To Time</label>
              <input
                type="time"
                name="toTime"
                value={formData.toTime}
                onChange={handleInputChange}
                className="w-full bg-white/10 p-3 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 [color-scheme:dark]"
              />
            </div>
          </div>

          {(!formData.location ||
            !formData.date ||
            !formData.fromTime ||
            !formData.toTime) && (
            <div className="text-white/60 text-sm text-center mt-2">
              Please fill in all fields to enable notifications
            </div>
          )}

          <Button
            variant="outline"
            onClick={handleNotifyWinners}
            disabled={
              notifyLoading ||
              !isAuthorized ||
              !formData.location ||
              !formData.date ||
              !formData.fromTime ||
              !formData.toTime
            }
            className="flex items-center justify-center gap-2 mx-auto mt-6"
          >
            {notifyLoading ? (
              <BiLoaderAlt className="animate-spin text-white" />
            ) : (
              "Notify Winners"
            )}
          </Button>
          {!isAuthorized && (
            <p className="text-red-400 text-sm text-center mt-2">
              You are not authorized to send notifications
            </p>
          )}
        </div>
      </>
    </div>
  );
};

export default ViewWinners;
