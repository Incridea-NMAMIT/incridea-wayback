import { useQuery } from "@apollo/client";
import Spinner from "~/components/spinner";
import { GetProniteRegistrationsDocument } from "~/generated/generated";

export default function ProniteRegistrationCard() {
  const { data, loading, error } = useQuery(GetProniteRegistrationsDocument);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const day1Count = data?.getProniteRegistrations?.day1Count ?? 0;
  const day2Count = data?.getProniteRegistrations?.day2Count ?? 0;

  return (
    <div className="flex-1 rounded-xl bg-white/10 backdrop-blur-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 flex justify-center items-center border-b border-white/20">
        <h2 className="text-2xl font-bold text-white">Pronite</h2>
        <div className="w-6 h-6 text-white/70"></div>
      </div>
      <div className="p-6">
        <div className="flex justify-between">
          <div className="text-center px-10">
            <p className="text-4xl font-bold mt-1 text-white">{day1Count}</p>
            <p className="text-base text-gray-300">Day 1</p>
          </div>
          <div className="h-16 w-px bg-white/20"></div>
          <div className="text-center px-10">
            <p className="text-4xl font-bold mt-1 text-white">{day2Count}</p>
            <p className="text-base text-gray-300">Day 2</p>
          </div>
        </div>
      </div>
    </div>
  );
}
