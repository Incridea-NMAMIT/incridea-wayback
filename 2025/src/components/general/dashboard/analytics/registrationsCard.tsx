import { useQuery } from "@apollo/client";
import Spinner from "~/components/spinner";
import { GetTotalRegistrationsDocument } from "~/generated/generated";

export default function RegistrationCard() {
  const { data, loading, error } = useQuery(GetTotalRegistrationsDocument);
  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const registrations =
    data?.getTotalRegistrations.__typename ===
    "QueryGetTotalRegistrationsSuccess"
      ? {
          total:
            data.getTotalRegistrations.data.internalRegistrations +
            data.getTotalRegistrations.data.externalRegistrations,
          internal: data.getTotalRegistrations.data.internalRegistrations,
          external: data.getTotalRegistrations.data.externalRegistrations,
        }
      : {};

  return (
    <div className="flex-1 rounded-xl bg-white/10 backdrop-blur-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 flex justify-center items-center border-b border-white/20">
        <h2 className="text-2xl font-bold text-white">Registrations</h2>
        <div className="w-6 h-6 text-white/70"></div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="text-center px-4">
            <p className="text-4xl font-bold mt-1 text-white">
              {registrations.total}
            </p>
            <p className="text-base text-gray-300">Total</p>
          </div>
          <div className="h-16 w-px bg-white/20"></div>
          <div className="text-center px-4">
            <p className="text-4xl font-bold mt-1 text-white">
              {registrations.internal}
            </p>
            <p className="text-base text-gray-300">Internal</p>
          </div>
          <div className="h-16 w-px bg-white/20"></div>
          <div className="text-center px-4">
            <p className="text-4xl font-bold mt-1 text-white">
              {registrations.external}
            </p>
            <p className="text-base text-gray-300">External</p>
          </div>
        </div>
      </div>
    </div>
  );
}
