import { type QueryResult, useQuery } from "@apollo/client";
import { type FC, useState, useRef, useEffect, useCallback } from "react";

import Button from "~/components/button";
import Modal from "~/components/modal";
import SearchBox from "~/components/searchbox";
import Spinner from "~/components/spinner";
import {
  type EventsByBranchRepQuery,
  type EventsByBranchRepQueryVariables,
  SearchUsersDocument,
} from "~/generated/generated";

import AddOrganizerButton from "./addOrganizerButton";
import RemoveOrganizerButton from "./removeOrganizerButton";

const AddOrganizerModal: FC<{
  eventId: string;
  organizers: Extract<
    EventsByBranchRepQuery["eventsByBranchRep"],
    {
      __typename: "QueryEventsByBranchRepSuccess";
    }
  >["data"][0]["organizers"];
  eventsRefetch: QueryResult<
    EventsByBranchRepQuery,
    EventsByBranchRepQueryVariables
  >["refetch"];
  eventName: string;
}> = ({ eventId, organizers, eventName }) => {
  const [showModal, setShowModal] = useState(false);

  function handleCloseModal() {
    setShowModal(false);
  }

  // Search Users Query
  // Currently searched user
  const [name, setName] = useState<string>("");

  const {
    data: searchUsersData,
    loading: searchUsersLoading,
    fetchMore: searchUsersFetchMore,
  } = useQuery(SearchUsersDocument, {
    variables: {
      first: 10,
      contains: name,
    },
  });

  /* Infinite Scroll Logic */
  // Get pageInfo for infinite scroll
  const { endCursor, hasNextPage } = searchUsersData?.users.pageInfo ?? {};

  // Create a ref for the last item in the list
  const lastItemRef = useRef<HTMLDivElement>(null);

  // State to check if we're fetching more data
  const [isFetching, setIsFetching] = useState(false);

  /* Intersection Observer callback function
   (memoize the handleObserver to avoid triggering unnecessary re-renders,
   function will only be recreated if any of its dependencies change, and not on every render) */
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0]!;
      if (target.isIntersecting && hasNextPage) {
        setIsFetching(true);
        void searchUsersFetchMore({
          variables: { after: endCursor },
          updateQuery: (prevResult, { fetchMoreResult }) => {
            fetchMoreResult.users.edges = [
              ...prevResult.users.edges,
              ...fetchMoreResult.users.edges,
            ];
            setIsFetching(false);
            return fetchMoreResult;
          },
        });
      }
    },
    [endCursor, hasNextPage, searchUsersFetchMore],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 1 });

    if (lastItemRef.current) {
      observer.observe(lastItemRef.current);
    }

    let currentRef = lastItemRef.current;

    // Observe changes to the lastItemRef.current value and update the observer accordingly, because initial value will be null
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

    // Return cleanup function that clears the intrval and disconnects observer.
    return () => {
      clearInterval(timeoutId);
      observer.disconnect();
    };
  }, [handleObserver, lastItemRef]);

  return (
    <>
      <Button
        className="mx-auto"
        onClick={() => {
          setShowModal(true);
        }}
      >
        Edit Organizers
        <span className="font-light">
          {organizers.length > 0 && <span>({organizers.length})</span>}
        </span>
      </Button>
      <Modal
        showModal={showModal}
        onClose={handleCloseModal}
        size="medium"
        title="Edit Organizers"
      >
        <div className={`flex flex-col gap-3 p-3 md:flex-row`}>
          <div className="basis-5/12 rounded-lg p-3">
            <div key={eventId}>
              <h1 className="mb-3 text-xl font-semibold">{eventName}</h1>
              {organizers.length === 0 && (
                <div className="flex h-64 items-center justify-center text-gray-400">
                  <h1 className="">No organizers added</h1>
                </div>
              )}
              <div className="max-h-64 overflow-y-auto pt-1 md:max-h-80">
                {organizers.map((organizer) => (
                  <div
                    key={organizer.user.id}
                    className="mb-3 flex items-center justify-between gap-5"
                  >
                    <h1>{organizer.user.name}</h1>
                    <RemoveOrganizerButton
                      organizerId={organizer.user.id}
                      eventId={eventId}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* List of queried users */}
          <div className="basis-7/12 rounded-lg bg-gray-700 p-3">
            <SearchBox
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <div className="mt-3 max-h-64 overflow-y-auto md:h-72 md:max-h-72">
              {searchUsersLoading && <Spinner size={"small"} />}
              {searchUsersData?.users?.edges.map((user, index) => (
                <div
                  key={index}
                  className="mb-2 mr-2 flex items-center justify-between rounded-lg border border-gray-500 p-1 px-2 md:p-2"
                  ref={
                    index === searchUsersData.users.edges.length - 1
                      ? lastItemRef
                      : null
                  }
                >
                  <div>
                    <h1 className="text-lg md:text-xl">{user?.node.name}</h1>
                    <h1 className="text-sm font-thin">{user?.node.email}</h1>
                  </div>
                  <AddOrganizerButton
                    eventId={eventId}
                    userId={user?.node.id}
                  />
                </div>
              ))}
              {isFetching && <Spinner size={"small"} />}
              {!hasNextPage && !searchUsersLoading && (
                <p className="my-5 text-center text-gray-400">
                  no more users to show
                </p>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddOrganizerModal;
