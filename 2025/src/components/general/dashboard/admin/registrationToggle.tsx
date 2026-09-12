import { useMutation, useQuery } from "@apollo/client";
import React from "react";
import toast from "react-hot-toast";
import Button from "~/components/button";
import {
  GetRegistrationsOpenDocument,
  ToggleRegistrationsOpenDocument,
} from "~/generated/generated";

const RegistrationToggle = () => {
  const { data, loading } = useQuery(GetRegistrationsOpenDocument);

  const [toggleRegistrationsOpen] = useMutation(
    ToggleRegistrationsOpenDocument,
    {
      refetchQueries: ["GetRegistrationsOpen"],
      awaitRefetchQueries: true,
    },
  );

  return (
    <div className="flex justify-center items-center flex-row gap-4">
      <Button
        onClick={async () => {
          toast.loading("Toggling registrations open status");

          const { data } = await toggleRegistrationsOpen();

          toast.dismiss();

          if (
            data?.toggleRegistrationsOpen.__typename ===
            "MutationToggleRegistrationsOpenSuccess"
          )
            toast.success(
              `Registrations ${data.toggleRegistrationsOpen.data ? "opened" : "closed"} successfully`,
            );
          else toast.error("Failed to toggle registrations open status");
        }}
        intent={
          loading || !data
            ? "info"
            : data?.getRegistrationsOpen.__typename ===
                "QueryGetRegistrationsOpenSuccess"
              ? data.getRegistrationsOpen.data
                ? "danger"
                : "success"
              : "success"
        }
        disabled={loading || !data}
      >
        {loading || !data
          ? "Loading..."
          : data.getRegistrationsOpen.__typename ===
              "QueryGetRegistrationsOpenSuccess"
            ? data.getRegistrationsOpen.data
              ? "Close Registrations"
              : "Open Registrations"
            : "Openregsitrations"}
      </Button>
    </div>
  );
};

export default RegistrationToggle;
