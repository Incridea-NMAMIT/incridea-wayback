import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import Dashboard from "~/components/layout/dashboard";
import { EventByOrganizerDocument } from "~/generated/generated";
import Spinner from "~/components/spinner";
import { useAuth } from "~/hooks/useAuth";
import { Role } from "~/generated/generated";
import Quiz from "~/components/general/dashboard/organizer/quiz/quiz";

const QuizPage = () => {
  const router = useRouter();
  const { user, loading: loading2 } = useAuth();
  const { slug } = router.query;

  const { data, loading } = useQuery(EventByOrganizerDocument);

  if (!data || data.eventByOrganizer.__typename === "Error" || data.eventByOrganizer.data.length === 0)
    return (
      <Dashboard>
        <div className="text-center flex flex-row font-medium text-lg">
          No Events Found
        </div>
      </Dashboard>
    );

  const [eventId, roundId] = slug?.toString().split("-") ?? [];
  const roundInt = parseInt(roundId ?? "0");

  const event = data?.eventByOrganizer.__typename === "QueryEventByOrganizerSuccess" ? data.eventByOrganizer.data.find((event) => event.id === eventId) : undefined;
  const round = event?.rounds.find((round) => round.roundNo === roundInt);

  if (loading2) {
    <div className="flex h-screen w-screen justify-center">
      <Spinner />
    </div>;
  }
  if (loading) {
    return <Spinner />;
  }


  if (user && user.role !== Role.Organizer) {
    void router.push("/profile");
    return null
  }


  if (!event || !round) {
    return (
      <Dashboard>
        <div className="text-center flex flex-row font-medium text-lg">
          Event or Round not found
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="mx-4 my-4 flex flex-row font-medium justify-around text-2xl">
        <p>Event Name: {event.name}</p>
        <p>Round: {roundId}</p>
      </div>
      <Quiz event={event} round={[round]} />
    </Dashboard>
  );
};

export default QuizPage;
