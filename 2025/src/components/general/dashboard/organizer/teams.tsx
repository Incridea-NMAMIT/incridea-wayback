import { useQuery } from "@apollo/client/react";
import { useCallback, useEffect, useRef, useState } from "react";

import Badge from "~/components/badge";
import Spinner from "~/components/spinner";
import { TeamsByRoundDocument } from "~/generated/generated";
import { idToTeamId } from "~/utils/id";

import DeleteTeamModal from "./deleteTeamModal";
import MarkAttendanceButton from "./markAttendanceButton";
import ViewTeamModal from "./viewTeamModal";

function Teams({
  eventType,
  roundNo,
  eventId,
  contains,
}: {
  eventType: string;
  roundNo: number;
  eventId: string;
  contains?: string;
}) {
  const { data, loading, fetchMore } = useQuery(TeamsByRoundDocument, {
    variables: {
      roundNo,
      eventId,
      first: 20,
      contains,
    },
  });

  const { endCursor, hasNextPage } = data?.teamsByRound.pageInfo ?? {};
  const lastItemRef = useRef<HTMLDivElement>(null);
  const [isFetching, setIsFetching] = useState(false);
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0]!;
      if (target.isIntersecting && hasNextPage) {
        setIsFetching(true);
        void fetchMore({
          variables: { after: endCursor },
          updateQuery: (prevResult, { fetchMoreResult }) => {
            fetchMoreResult.teamsByRound.edges = [
              ...prevResult.teamsByRound.edges,
              ...fetchMoreResult.teamsByRound.edges,
            ];
            setIsFetching(false);
            return fetchMoreResult;
          },
        });
      }
    },
    [endCursor, hasNextPage, fetchMore],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 1 });
    if (lastItemRef.current) {
      observer.observe(lastItemRef.current);
    }
    let currentRef = lastItemRef.current;
    const updateObserver = () => {
      if (currentRef !== lastItemRef.current) {
        if (currentRef) {
          observer.unobserve(currentRef);
        }

        if (lastItemRef.current) {
          observer.observe(lastItemRef.current);
          currentRef = lastItemRef.current;
        }
      }
    };
    const timeoutId = setInterval(updateObserver, 1000);
    return () => {
      clearInterval(timeoutId);
      observer.disconnect();
    };
  }, [handleObserver, lastItemRef]);

  const teamOrParticipant =
    eventType === "INDIVIDUAL" || eventType === "INDIVIDUAL_MULTIPLE_ENTRY"
      ? "Participant"
      : "Team";

  if (loading) return <Spinner />;
  if (!data || data.teamsByRound.edges.length === 0)
    return (
      <p className="my-3 text-center italic text-gray-400/70">no teams here</p>
    );

  return (
    <div>
      {data.teamsByRound.edges.map((team, index) => (
        <div
          className="mb-2 flex flex-col flex-wrap items-center justify-start gap-2 rounded-lg bg-gray-600/40 p-3 text-start md:flex-row md:justify-between md:text-center"
          key={team?.node.id}
          ref={
            index === data.teamsByRound.edges.length - 1 ? lastItemRef : null
          }
        >
          <h2 className="flex flex-col items-center justify-center gap-2 text-base font-semibold md:flex-row md:text-xl">
            <Badge color={"info"}>{idToTeamId(team?.node.id)}</Badge>
            {team?.node.name}
          </h2>
          <div className="flex gap-2 md:flex-row">
            {/* Mark Attendance */}
            <MarkAttendanceButton
              attended={team?.node.attended}
              teamId={team?.node.id}
            />

            {/* View Team */}
            <ViewTeamModal
              teamId={team?.node.id}
              teamName={team?.node.name || ""}
            />

            {/* Delete Team or Participant */}
            <DeleteTeamModal
              attended={team?.node.attended}
              teamId={team?.node.id}
              teamOrParticipant={teamOrParticipant}
            />
          </div>
        </div>
      ))}
      {isFetching && <Spinner />}
      {!hasNextPage && !loading && (
        <p className="my-3 mt-5 text-center italic text-gray-400/70">
          no more teams/users to show
        </p>
      )}
    </div>
  );
}

export default Teams;
